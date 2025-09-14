STORYBOARD_JSON_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Storyboard",
    "type": "object",
    "required": [
        "product_name",
        "suggested_duration_seconds",
        "scenes",
        "coverage",
        "assumptions",
        "risks",
        "transcript"
    ],
    "properties": {
        "product_name": {"type": "string"},
        "suggested_duration_seconds": {"type": "integer", "minimum": 15, "maximum": 1200},
        "target_audience": {"type": "string"},
        "goal": {"type": "string"},
        "scenes": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["id", "title", "duration_seconds", "narration", "actions"],
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "duration_seconds": {"type": "integer", "minimum": 2, "maximum": 300},
                "narration": {"type": "string"},
                "on_screen_text": {"type": "string"},
                "shots": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["id", "start_seconds", "end_seconds", "camera_move"],
                        "properties": {
                            "id": {"type": "string"},
                            "start_seconds": {"type": "number", "minimum": 0},
                            "end_seconds": {"type": "number", "minimum": 0},
                            "camera_move": {"type": "string", "enum": [
                                "static", "zoom_in", "zoom_out", "pan_left", "pan_right", "pan_up", "pan_down", "focus_element"
                            ]},
                            "target_selector": {"type": "string"},
                            "by": {"type": "string", "enum": ["role", "text", "css", "xpath", "aria"]},
                            "zoom_to": {"type": "number", "minimum": 1.0, "maximum": 8.0},
                            "pan_vector": {
                                "type": "object",
                                "properties": {
                                    "x": {"type": "number"},
                                    "y": {"type": "number"}
                                },
                                "additionalProperties": False
                            },
                            "easing": {"type": "string", "enum": ["linear", "ease-in", "ease-out", "ease-in-out"]},
                            "transition_after": {"type": "string", "enum": ["cut", "dissolve", "slide", "none"]},
                            "emphasis": {"type": "array", "items": {"type": "string", "enum": ["highlight", "blur_background", "cursor_pulse"]}},
                            "overlay": {
                                "type": "object",
                                "properties": {
                                    "text": {"type": "string"},
                                    "position": {"type": "string", "enum": ["top-left", "top-right", "bottom-left", "bottom-right", "center"]}
                                },
                                "additionalProperties": False
                            },
                            "action_index": {"type": "integer", "minimum": 0}
                        },
                        "additionalProperties": False
                    }
                },
                "actions": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": ["type"],
                            "properties": {
                                "type": {"type": "string", "enum": ["navigate", "click", "input", "scroll", "wait", "assert"]},
                                "url": {"type": "string"},
                                "selector": {"type": "string"},
                                "by": {"type": "string", "enum": ["role", "text", "css", "xpath", "aria"]},
                                "value": {"type": "string"},
                                "expected_result": {"type": "string"},
                                "notes": {"type": "string"}
                            },
                            "additionalProperties": False
                        }
                    }
                },
                "additionalProperties": False
            }
        },
        "coverage": {
            "type": "object",
            "required": ["features", "buttons_clicked", "forms_tested"],
            "properties": {
                "features": {"type": "array", "items": {"type": "string"}},
                "buttons_clicked": {"type": "array", "items": {"type": "string"}},
                "forms_tested": {"type": "array", "items": {"type": "string"}}
            },
            "additionalProperties": False
        },
        "assumptions": {"type": "array", "items": {"type": "string"}},
        "risks": {"type": "array", "items": {"type": "string"}},
        "transcript": {
            "type": "object",
            "required": ["language", "segments"],
            "properties": {
                "language": {"type": "string"},
                "segments": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": ["start_seconds", "end_seconds", "text"],
                        "properties": {
                            "scene_id": {"type": "string"},
                            "action_index": {"type": "integer", "minimum": 0},
                            "start_seconds": {"type": "number", "minimum": 0},
                            "end_seconds": {"type": "number", "minimum": 0},
                            "text": {"type": "string"}
                        },
                        "additionalProperties": False
                    }
                }
            },
            "additionalProperties": False
        },
        "visual_style": {
            "type": "object",
            "properties": {
                "default_easing": {"type": "string", "enum": ["linear", "ease-in", "ease-out", "ease-in-out"]},
                "default_transition": {"type": "string", "enum": ["cut", "dissolve", "slide", "none"]},
                "background_blur": {"type": "boolean"},
                "cursor_emphasis": {"type": "boolean"}
            },
            "additionalProperties": False
        }
    },
    "additionalProperties": False
}
