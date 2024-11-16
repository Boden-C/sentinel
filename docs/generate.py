import ast
import os
import re
from typing import List

def generate_structure(root_dirs, output_file):
    """
    Generates a folder structure documentation for the given root directories and writes it to a Markdown file.

    Args:
        root_dirs (list of str): List of directories to include in the structure documentation.
        output_file (str): Path of the file to write the generated structure documentation.
    """
    def format_directory_structure(dir_path, prefix=""):
        """
        Recursively formats the structure of a directory and its subdirectories/files.

        Args:
            dir_path (str): The path of the directory to format.
            prefix (str): The prefix to add to each line for hierarchical structure.
        
        Returns:
            str: Formatted string representing the directory structure.
        """
        structure = ""
        for item in sorted(os.listdir(dir_path)):
            if item == '__pycache__':
                continue
            full_path = os.path.join(dir_path, item)
            if os.path.isdir(full_path):
                structure += f"{prefix}- {item}/\n"
                structure += format_directory_structure(full_path, prefix + "  ")
            else:
                structure += f"{prefix}- {item}\n"
        return structure

    # Start building the document content
    doc_content = "# Project Folder Structure\n\n"
    for root_dir in root_dirs:
        doc_content += f"{root_dir}/\n"
        doc_content += format_directory_structure(root_dir)
        doc_content += "\n"

    # Add a note about config files in the root
    doc_content += "Config files are in root\n"

    # Write to the output file
    with open(output_file, 'w') as f:
        f.write(doc_content)
        
def extract_functions_from_python(file_path: str) -> List[str]:
    """
    Extracts functions and their docstrings from a Python file.

    Args:
        file_path (str): The path to the Python file.

    Returns:
        List[str]: A list of formatted strings for each function's signature and docstring.
    """
    with open(file_path, "r") as file:
        file_content = file.read()

    tree = ast.parse(file_content)
    functions_info = []

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            # Extract function signature
            func_name = node.name
            args = [arg.arg for arg in node.args.args]
            args_with_types = []
            for arg in node.args.args:
                if arg.annotation:
                    args_with_types.append(f"{arg.arg}: {ast.unparse(arg.annotation)}")
                else:
                    args_with_types.append(arg.arg)
            arg_string = ", ".join(args_with_types)

            # Determine the return type if it exists
            return_annotation = ""
            if node.returns:
                return_annotation = f" -> {ast.unparse(node.returns)}"

            signature = f"{func_name}({arg_string}){return_annotation}"

            # Extract docstring
            docstring = ast.get_docstring(node) or ""
            docstring_lines = docstring.split("\n")
            formatted_docstring = "\n    ".join(docstring_lines)

            # Build the final format
            module_path = file_path.replace("/", ".").replace("\\", ".").replace(".py", "")
            function_info = f"`{module_path}.{signature}`\n{"```\n"+formatted_docstring+"\n```"}"
            functions_info.append(function_info)

    return functions_info


def generate_functions_documentation(root_dirs, output_file):
    """
    Generates a documentation file listing all functions in the Python files in the given directories,
    with their signatures and docstrings.

    Args:
        root_dirs (list of str): List of directories to scan for Python files.
        output_file (str): Path of the file to write the generated function documentation.
    """
    doc_content = "# Backend Function Documentaion\n\n"
    for root_dir in root_dirs:
        for subdir, _, files in os.walk(root_dir):
            for file_name in files:
                if file_name.endswith(".py") and file_name != "generate.py":
                    file_path = os.path.join(subdir, file_name)
                    functions_info = extract_functions_from_python(file_path)
                    if functions_info:
                        doc_content += f"## {file_path.replace("\\","/")}\n"
                        for function_info in functions_info:
                            doc_content += f"{function_info}\n\n"

    with open(output_file, 'w') as f:
        f.write(doc_content)
        
def extract_function_from_js(file_path: str) -> List[str]:
    """
    Extracts JSDoc comments and the line immediately following them from a JavaScript file.

    Args:
        file_path (str): The path to the JavaScript file.

    Returns:
        List[str]: A list of formatted strings for each JSDoc comment and the line following it.
    """
    with open(file_path, "r") as file:
        file_content = file.read()

    # Regex pattern to capture full JSDoc comment and the line immediately after
    jsdoc_pattern = re.compile(r"(/\*\*[\s\S]*?\*/)\s*\n\s*(.*)")

    functions_info = []

    for match in jsdoc_pattern.finditer(file_content):
        jsdoc_comment = match.group(1).strip()
        following_line = match.group(2).strip()

        # Format JSDoc comment
        formatted_jsdoc = "\n    ".join(jsdoc_comment.splitlines())

        # Format the output for documentation
        functions_info.append(f"{formatted_jsdoc.replace("    ","")}\n    {following_line.replace("\t","")}")

    return functions_info

def generate_js_functions_documentation(root_dirs, output_file):
    """
    Generates documentation for functions in JavaScript and JSX files in the given directories.

    Args:
        root_dirs (list of str): List of directories to scan for JavaScript/JSX files.
        output_file (str): Path of the file to write the generated function documentation.
    """
    doc_content = "\n# Frontend Function Documentation\n\n"
    for root_dir in root_dirs:
        for subdir, _, files in os.walk(root_dir):
            for file_name in files:
                if file_name.endswith((".js", ".jsx")):
                    file_path = os.path.join(subdir, file_name)
                    functions_info = extract_function_from_js(file_path)
                    if functions_info:
                        doc_content += f"## {file_path.replace(os.sep, '/')}\n\n"
                        for function_info in functions_info:
                            doc_content += f"{function_info}\n\n"

    # Append the content to the existing file or create it if it doesn't exist
    with open(output_file, 'a') as f:
        f.write(doc_content)


if __name__ == "__main__":
    root_dirs = ["api", "src", "tests"]
    
    # Generate the folder structure documentation
    generate_structure(root_dirs, "docs/structure.md")
    
    # Generate the functions documentation
    generate_functions_documentation(root_dirs, "docs/backend.md")
    
    # Generate the frontend functions documentation
    generate_js_functions_documentation(root_dirs, "docs/frontend.md")
