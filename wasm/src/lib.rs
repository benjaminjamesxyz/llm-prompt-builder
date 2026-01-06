use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize, Deserialize, Clone)]
pub struct Node {
    pub id: String,
    pub tag: String,
    pub content: String,
    #[serde(rename = "isList")]
    pub is_list: Option<bool>,
    pub children: Option<Vec<Node>>,
}

const NODE_INDENT_SPACES: usize = 2;

#[wasm_bindgen]
pub fn calculate_tokens(text: &str) -> usize {
    let char_count = text.len();
    let word_count = text.split_whitespace().count();
    let char_est = (char_count as f64) / 4.0;
    let word_est = (word_count as f64) / 0.75;
    ((char_est + word_est) / 2.0).ceil() as usize
}

// --- XML Formatter ---

#[wasm_bindgen]
pub fn fast_xml(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    Ok(to_xml_recursive(&nodes, 0))
}

fn to_xml_recursive(nodes: &[Node], indent: usize) -> String {
    nodes
        .iter()
        .map(|node| {
            let sp = " ".repeat(NODE_INDENT_SPACES * indent);
            let has_newlines = node.content.contains('\n');
            let inner = if let Some(children) = &node.children {
                if !children.is_empty() {
                    format!("\n{}\n{}", to_xml_recursive(children, indent + 1), sp)
                } else {
                    format_content(&node.content, has_newlines, &sp)
                }
            } else {
                format_content(&node.content, has_newlines, &sp)
            };
            format!("{0}<{1}>{2}</{1}>", sp, node.tag, inner)
        })
        .collect::<Vec<String>>()
        .join("\n")
}

fn format_content(content: &str, has_newlines: bool, sp: &str) -> String {
    if has_newlines {
        let indent_block = " ".repeat(NODE_INDENT_SPACES);
        let indented_content = content.replace('\n', &format!("\n{}{}", sp, indent_block));
        format!("\n{}{}{}\n", sp, indent_block, indented_content)
    } else {
        content.to_string()
    }
}

// --- JSON & YAML Helper: PromptTree ---

#[derive(Clone)]
enum PromptValue {
    String(String),
    Array(Vec<PromptValue>),
    Object(Vec<(String, PromptValue)>),
}

fn to_prompt_tree(nodes: &[Node]) -> PromptValue {
    let mut entries: Vec<(String, PromptValue)> = Vec::new();

    for node in nodes {
        let key = if node.tag.is_empty() {
            "BLOCK".to_string()
        } else {
            node.tag.clone()
        };

        let value = if let Some(children) = &node.children {
            if !children.is_empty() {
                to_prompt_tree(children)
            } else {
                PromptValue::String(node.content.clone())
            }
        } else {
            PromptValue::String(node.content.clone())
        };

        let mut found = false;
        for (existing_key, existing_val) in entries.iter_mut() {
            if *existing_key == key {
                found = true;
                match existing_val {
                    PromptValue::Array(arr) => {
                        arr.push(value.clone());
                    }
                    _ => {
                        let old_val =
                            std::mem::replace(existing_val, PromptValue::Array(Vec::new()));
                        if let PromptValue::Array(arr) = existing_val {
                            arr.push(old_val);
                            arr.push(value.clone());
                        }
                    }
                }
                break;
            }
        }

        if !found {
            entries.push((key, value));
        }
    }

    PromptValue::Object(entries)
}

// --- JSON Formatter (Manual) ---

#[wasm_bindgen]
pub fn fast_json(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    let tree = to_prompt_tree(&nodes);
    Ok(json_stringify(&tree, 0))
}

fn json_stringify(val: &PromptValue, indent: usize) -> String {
    let sp = " ".repeat(indent);
    match val {
        PromptValue::String(s) => escape_json_string(s),
        PromptValue::Array(arr) => {
            if arr.is_empty() {
                return "[]".to_string();
            }
            let mut out = String::from(
                "[
",
            );
            for (i, item) in arr.iter().enumerate() {
                out.push_str(&format!(
                    "{}{} {}",
                    " ".repeat(indent + 2),
                    json_stringify(item, indent + 2),
                    if i < arr.len() - 1 { "," } else { "" }
                ));
                out.push('\n');
            }
            out.push_str(&format!("{}}}", sp));
            out
        }
        PromptValue::Object(obj) => {
            if obj.is_empty() {
                return "{}".to_string();
            }
            let mut out = String::from("{\n");
            for (i, (k, v)) in obj.iter().enumerate() {
                out.push_str(&format!(
                    "{}{}: {}{}",
                    " ".repeat(indent + 2),
                    escape_json_string(k),
                    json_stringify(v, indent + 2),
                    if i < obj.len() - 1 { "," } else { "" }
                ));
                out.push('\n');
            }
            out.push_str(&format!("{}}}", sp));
            out
        }
    }
}

fn escape_json_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\x08' => out.push_str("\\b"),
            '\x0c' => out.push_str("\\f"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            _ => out.push(c),
        }
    }
    out.push('"');
    out
}

// --- YAML Formatter (Manual) ---

#[wasm_bindgen]
pub fn fast_yaml(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    let tree = to_prompt_tree(&nodes);
    Ok(yaml_stringify(&tree, 0))
}

fn yaml_stringify(val: &PromptValue, indent: usize) -> String {
    match val {
        PromptValue::String(s) => escape_json_string(s), // Valid YAML scalar
        PromptValue::Array(arr) => {
            let sp = " ".repeat(indent);
            let mut out = String::new();
            for item in arr {
                out.push_str(&format!("{}- ", sp));
                let s_item = yaml_stringify(item, indent + 2);
                out.push_str(s_item.trim_start());
                out.push('\n');
            }
            out
        }
        PromptValue::Object(obj) => {
            let sp = " ".repeat(indent);
            let mut out = String::new();
            for (k, v) in obj {
                out.push_str(&format!("{}{}: ", sp, k));
                match v {
                    PromptValue::String(_) => {
                        out.push_str(&yaml_stringify(v, 0));
                        out.push('\n');
                    }
                    PromptValue::Array(_) => {
                        out.push('\n');
                        out.push_str(&yaml_stringify(v, indent));
                    }
                    PromptValue::Object(_) => {
                        out.push('\n');
                        out.push_str(&yaml_stringify(v, indent + 2));
                    }
                }
            }
            out
        }
    }
}

// --- Markdown Formatter ---

#[wasm_bindgen]
pub fn fast_markdown(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    Ok(to_markdown_recursive(&nodes, 1))
}

fn to_markdown_recursive(nodes: &[Node], level: usize) -> String {
    let mut out = String::new();
    for node in nodes {
        let header = "#".repeat(level);
        out.push_str(&format!(
            "{} {}
",
            header, node.tag
        ));
        if !node.content.is_empty() {
            out.push_str(&format!("{}\n\n", node.content));
        }

        if let Some(children) = &node.children {
            if !children.is_empty() {
                out.push_str(&to_markdown_recursive(children, level + 1));
            }
        }
    }
    out
}

// --- TOON Formatter ---

#[wasm_bindgen]
pub fn fast_toon(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    Ok(to_toon_recursive(&nodes, 0))
}

fn to_toon_recursive(nodes: &[Node], indent: usize) -> String {
    let mut out = String::new();
    let sp = " ".repeat(NODE_INDENT_SPACES * indent);

    for node in nodes {
        let key = &node.tag;

        if node.children.as_ref().is_none_or(|c| c.is_empty()) {
            let mut val = node.content.clone();
            if val.contains('\n') {
                val = format!("\"{}\"", val.replace('\n', "\\n"));
            }
            out.push_str(&format!(
                "{}{}: {}
",
                sp, key, val
            ));
            continue;
        }

        let children = node.children.as_ref().unwrap();
        let count = children.len();

        let all_children_are_leaves = children
            .iter()
            .all(|c| c.children.as_ref().is_none_or(|gc| gc.is_empty()));
        let all_tags_identical = if let Some(first) = children.first() {
            children.iter().all(|c| c.tag == first.tag)
        } else {
            true
        };

        if all_children_are_leaves && all_tags_identical {
            let values: Vec<String> = children
                .iter()
                .map(|c| {
                    let mut v = c.content.clone();
                    if v.contains(',') || v.contains('\n') {
                        v = format!("\"{}\"", v.replace('"', "\"\""));
                    }
                    v
                })
                .collect();
            out.push_str(&format!(
                "{}{}[{}]: {}
",
                sp,
                key,
                count,
                values.join(",")
            ));
            continue;
        }

        let all_children_have_children = children
            .iter()
            .all(|c| c.children.as_ref().is_some_and(|gc| !gc.is_empty()));
        if all_children_have_children && all_tags_identical {
            let first_child = &children[0];
            let columns: Vec<String> = first_child
                .children
                .as_ref()
                .unwrap()
                .iter()
                .map(|c| c.tag.clone())
                .collect();

            out.push_str(&format!(
                "{}{}[{}]{{{}}}:\n",
                sp,
                key,
                count,
                columns.join(",")
            ));

            for child in children {
                let row: Vec<String> = columns
                    .iter()
                    .map(|col_tag| {
                        if let Some(cell_node) = child
                            .children
                            .as_ref()
                            .unwrap()
                            .iter()
                            .find(|c| &c.tag == col_tag)
                        {
                            let val = cell_node.content.clone();
                            let is_bool = val == "true" || val == "false";
                            let is_number = val.parse::<f64>().is_ok() && !val.trim().is_empty();

                            if is_bool || is_number {
                                val
                            } else if val.contains(',') || val.contains('\n') || val.contains('"') {
                                format!("\"{}\"", val.replace('"', "\"\""))
                            } else {
                                val
                            }
                        } else {
                            String::new()
                        }
                    })
                    .collect();
                out.push_str(&format!(
                    "{}{}\n",
                    sp.replace(" ", "  ") + "  ",
                    row.join(",")
                ));
            }
            continue;
        }

        out.push_str(&format!("{}{}:\n", sp, key));
        out.push_str(&to_toon_recursive(children, indent + 1));
    }

    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mock_node(tag: &str, content: &str) -> Node {
        Node {
            id: "test".to_string(),
            tag: tag.to_string(),
            content: content.to_string(),
            is_list: None,
            children: None,
        }
    }

    #[test]
    fn test_calculate_tokens() {
        assert_eq!(calculate_tokens("Hello world"), 3);
    }

    #[test]
    fn test_fast_json_order() {
        let nodes = vec![
            mock_node("Z_LAST", "Content"),
            mock_node("A_FIRST", "Content"),
        ];
        let tree = to_prompt_tree(&nodes);
        let json_str = json_stringify(&tree, 0);
        let first_pos = json_str.find("Z_LAST").unwrap();
        let second_pos = json_str.find("A_FIRST").unwrap();
        assert!(
            first_pos < second_pos,
            "Keys should preserve insertion order"
        );
    }

    #[test]
    fn test_fast_yaml_basic() {
        let nodes = vec![mock_node("ROLE", "Assistant")];
        let tree = to_prompt_tree(&nodes);
        let yaml = yaml_stringify(&tree, 0);
        assert!(yaml.contains("ROLE: \"Assistant\""));

    #[test]
    fn test_to_xml_recursive() {
        let nodes = vec![
            mock_node("ROLE", "Assistant"),
            Node {
                id: "2".to_string(),
                tag: "NESTED".to_string(),
                content: "".to_string(),
                is_list: None,
                children: Some(vec![mock_node("ITEM", "Value")]),
            },
        ];
        let result = to_xml_recursive(&nodes, 0);
        assert!(result.contains("<ROLE>Assistant</ROLE>"));
        assert!(result.contains("<NESTED>"));
        assert!(result.contains("<ITEM>Value</ITEM>"));
        // Check for NO blank lines (double newlines)
        assert!(!result.contains("\n\n"));
    }

    #[test]
    fn test_to_markdown_recursive() {
        let nodes = vec![mock_node("TASK", "Do something")];
        let result = to_markdown_recursive(&nodes, 1);
        assert_eq!(result, "# TASK\nDo something\n\n");
    }

    #[test]
    fn test_to_toon_recursive_simple() {
        let nodes = vec![mock_node("KEY", "Value")];
        let result = to_toon_recursive(&nodes, 0);
        assert_eq!(result, "KEY: Value\n");
    }

    #[test]
    fn test_to_toon_recursive_compact_list() {
        let nodes = vec![Node {
            id: "1".to_string(),
            tag: "LIST".to_string(),
            content: "".to_string(),
            is_list: None,
            children: Some(vec![mock_node("ITEM", "A"), mock_node("ITEM", "B")]),
        }];
        let result = to_toon_recursive(&nodes, 0);
        assert_eq!(result, "LIST[2]: A,B\n");
    }

    #[test]
    fn test_to_toon_recursive_table() {
        let child1 = Node {
            id: "c1".to_string(),
            tag: "ROW".to_string(),
            content: "".to_string(),
            is_list: None,
            children: Some(vec![mock_node("COL1", "V1"), mock_node("COL2", "V2")]),
        };
        let nodes = vec![Node {
            id: "p1".to_string(),
            tag: "TABLE".to_string(),
            content: "".to_string(),
            is_list: None,
            children: Some(vec![child1]),
        }];
        let result = to_toon_recursive(&nodes, 0);
        assert!(result.contains("TABLE[1]{COL1,COL2}:"));
        assert!(result.contains("V1,V2"));
    }
    }
}
