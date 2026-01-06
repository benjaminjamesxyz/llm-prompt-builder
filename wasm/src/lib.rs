use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
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
            format!("{}
<{}>{}</{}>", sp, node.tag, inner, node.tag)
        })
        .collect::<Vec<String>>()
        .join("\n")
}

fn format_content(content: &str, has_newlines: bool, sp: &str) -> String {
    if has_newlines {
        let indent_block = " ".repeat(NODE_INDENT_SPACES);
        let indented_content = content.replace('\n', &format!("\n{}{}", sp, indent_block));
        format!("\n{}{}{}\n{}", sp, indent_block, indented_content, sp)
    } else {
        content.to_string()
    }
}

// --- JSON & YAML Helper: to_object_tree logic ---

fn to_object_tree(nodes: &[Node]) -> Value {
    let mut map = Map::new();

    for node in nodes {
        let key = if node.tag.is_empty() {
            "BLOCK".to_string()
        } else {
            node.tag.clone()
        };

        let value = if let Some(children) = &node.children {
            if !children.is_empty() {
                to_object_tree(children)
            } else {
                Value::String(node.content.clone())
            }
        } else {
            Value::String(node.content.clone())
        };

        if let Some(existing) = map.get_mut(&key) {
            if let Some(arr) = existing.as_array_mut() {
                arr.push(value);
            } else {
                // Convert existing single value to array
                let old_val = existing.clone();
                *existing = Value::Array(vec![old_val, value]);
            }
        } else {
            map.insert(key, value);
        }
    }

    Value::Object(map)
}

#[wasm_bindgen]
pub fn fast_json(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    let tree = to_object_tree(&nodes);
    serde_json::to_string_pretty(&tree).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn fast_yaml(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    let tree = to_object_tree(&nodes);
    serde_yaml::to_string(&tree).map_err(|e| JsValue::from_str(&e.to_string()))
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
        out.push_str(&format!("{} {}
", header, node.tag));

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

        // Leaf node or empty children
        if node.children.as_ref().is_none_or(|c| c.is_empty()) {
            let mut val = node.content.clone();
            if val.contains('\n') {
                val = format!("\"{}\"", val.replace('\n', "\\n"));
            }
            out.push_str(&format!("{}{}: \"{}\"\n", sp, key, val));
            continue;
        }

        // Has children
        let children = node.children.as_ref().unwrap();
        let count = children.len();

        let all_children_are_leaves = children
            .iter()
            .all(|c| c.children.as_ref().is_none_or(|gc| gc.is_empty()));
        // Check if all tags are identical
        let all_tags_identical = if let Some(first) = children.first() {
            children.iter().all(|c| c.tag == first.tag)
        } else {
            true // technically vacuous truth, but count=0 handled above
        };

        // Compact list syntax: KEY[N]: val1,val2...
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
            out.push_str(&format!("{}{}[{}]: {}\n", sp, key, count, values.join(",")));
            continue;
        }

        // Table syntax: KEY[N]{col1,col2...}:
        let all_children_have_children = children
            .iter()
            .all(|c| c.children.as_ref().is_some_and(|gc| !gc.is_empty()));
        if all_children_have_children && all_tags_identical {
            let first_child = &children[0];
            // Safe unwrap because all_children_have_children is true
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

        // Standard nested structure
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
    fn test_to_xml_recursive() {
        let nodes = vec![
            mock_node("ROLE", "Assistant"),
            Node {
                id: "2".to_string(),
                tag: "NESTED".to_string(),
                content: "".to_string(),
                is_list: None,
                children: Some(vec![mock_node("ITEM", "Value")])
            },
        ];
        let result = to_xml_recursive(&nodes, 0);
        assert!(result.contains("<ROLE>Assistant</ROLE>"));
        assert!(result.contains("<NESTED>"));
        assert!(result.contains("<ITEM>Value</ITEM>"));
    }

    #[test]
    fn test_to_object_tree() {
        let nodes = vec![mock_node("ROLE", "Assistant"), mock_node("ROLE", "Hero")]; // Test array conversion
        let tree = to_object_tree(&nodes);
        assert!(tree.is_object());
        let obj = tree.as_object().unwrap();
        assert!(obj.contains_key("ROLE"));
        assert!(obj["ROLE"].is_array());
        assert_eq!(obj["ROLE"][0], "Assistant");
        assert_eq!(obj["ROLE"][1], "Hero");
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
        assert_eq!(result, "KEY: \"Value\"\n");
    }

    #[test]
    fn test_to_toon_recursive_compact_list() {
        let nodes = vec![Node {
            id: "1".to_string(),
            tag: "LIST".to_string(),
            content: "".to_string(),
            is_list: None,
            children: Some(vec![mock_node("ITEM", "A"), mock_node("ITEM", "B")])
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
            children: Some(vec![mock_node("COL1", "V1"), mock_node("COL2", "V2")])
        };
        let nodes = vec![Node {
            id: "p1".to_string(),
            tag: "TABLE".to_string(),
            content: "".to_string(),
            is_list: None,
            children: Some(vec![child1])
        }];
        let result = to_toon_recursive(&nodes, 0);
        assert!(result.contains("TABLE[1]{COL1,COL2}:"));
        assert!(result.contains("V1,V2"));
    }
}
