use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
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
    // Simple heuristic: 1 token ~= 4 characters or 0.75 words
    // This is a rough estimation for standard LLM tokenizers
    let char_count = text.len();
    let word_count = text.split_whitespace().count();
    
    // Average of char-based and word-based estimation
    let char_est = (char_count as f64) / 4.0;
    let word_est = (word_count as f64) / 0.75;
    
    ((char_est + word_est) / 2.0).ceil() as usize
}

#[wasm_bindgen]
pub fn fast_xml(val: JsValue) -> Result<String, JsValue> {
    let nodes: Vec<Node> = serde_wasm_bindgen::from_value(val)?;
    Ok(to_xml_recursive(&nodes, 0))
}

fn to_xml_recursive(nodes: &Vec<Node>, indent: usize) -> String {
    let sp = " ".repeat(NODE_INDENT_SPACES * indent);
    let mut out = String::new();

    for node in nodes {
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

        out.push_str(&format!("{}
<{}>{}</{}>
", sp, node.tag, inner, node.tag));
    }
    
    // Remove the last newline to match JS behavior exactly if needed, 
    // but the JS one does .join('\n') which puts newlines between items.
    // My loop puts newline at end of each.
    // Let's refine to match exactly:
    
    // Re-implementation with map/join style to ensure identical output
    nodes.iter().map(|node| {
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
    }).collect::<Vec<String>>().join("\n")
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_tokens() {
        // "Hello world" -> 11 chars, 2 words.
        // Char est: 11 / 4 = 2.75
        // Word est: 2 / 0.75 = 2.66
        // Avg: 2.70 -> Ceil: 3
        
        // Wait, my manual math:
        // "Hello world"
        // chars = 11. est = 2.75
        // words = 2. est = 2.666
        // avg = 2.708
        // ceil = 3
        
        assert_eq!(calculate_tokens("Hello world"), 3);
    }
}