def safe_parse_json(text: str):
    try:
        # Step 1: Remove markdown wrappers like ```json ```
        cleaned = re.sub(r"```json|```", "", text).strip()

        # Step 2: Extract only JSON part (between { ... })
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise ValueError("No JSON object found")

        json_text = match.group()

        # Step 3: Convert to Python dict
        return json.loads(json_text)

    except Exception as e:
        raise ValueError(f"Parsing failed: {str(e)}")