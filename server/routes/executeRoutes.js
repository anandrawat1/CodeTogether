const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { code, language, stdin } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required",
            });
        }

        // Get available compilers from Wandbox
        const compilerList = await axios.get(
            "https://wandbox.org/api/list.json"
        );

        const compilers = compilerList.data;

        const languageMap = {
            cpp: "C++",
            java: "Java",
            python: "Python",
            javascript: "JavaScript",
        };

        const targetLanguage = languageMap[language.toLowerCase()];

        if (!targetLanguage) {
            return res.status(400).json({
                success: false,
                message: `Unsupported language: ${language}`,
            });
        }

        // Find a compiler for requested language
        const compiler = compilers.find(
            (item) => item.language === targetLanguage
        );

        if (!compiler) {
            return res.status(400).json({
                success: false,
                message: `No compiler found for ${targetLanguage}`,
            });
        }

        // Send code to Wandbox
        const response = await axios.post(
            "https://wandbox.org/api/compile.json",
            {
                code,
                compiler: compiler.name,
                stdin: stdin || "",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const result = response.data;

        res.json({
            success: true,
            output:
                result.program_output ||
                result.program_message ||
                result.compiler_error ||
                result.compiler_message ||
                "No output",
        });
    } catch (error) {
        console.error(
            "Code execution error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Code execution failed",
            error: error.response?.data || error.message,
        });
    }
});

module.exports = router;