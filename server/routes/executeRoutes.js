const express = require("express");
const axios = require("axios");

const router = express.Router();

const compilerMap = {
    cpp: "gcc-head",
    java: "openjdk-head",
    python: "cpython-head",
    javascript: "nodejs-head"
};

router.post("/", async (req, res) => {
    try {
        const { code, language, stdin } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required"
            });
        }

        const lang = language.toLowerCase();
        const compiler = compilerMap[lang];

        if (!compiler) {
            return res.status(400).json({
                success: false,
                message: `Unsupported language: ${language}`
            });
        }

        console.log("Executing:", {
            language: lang,
            compiler: compiler
        });

        const response = await axios.post(
            "https://wandbox.org/api/compile.json",
            {
                code: code,
                compiler: compiler,
                stdin: stdin || ""
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        const result = response.data;

        console.log("Wandbox response:", result);

        res.json({
            success: true,
            output:
                result.program_output ||
                result.program_message ||
                result.compiler_error ||
                result.compiler_message ||
                "No output"
        });

    } catch (error) {

        console.error(
            "Code execution error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Code execution failed",
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;