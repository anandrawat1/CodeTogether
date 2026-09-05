const express = require("express");
const axios = require("axios");

const router = express.Router();

const JUDGE0_URL = "https://ce.judge0.com";

const languageMap = {
  cpp: 54,
  java: 62,
  javascript: 63,
  python: 71,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/", async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required",
      });
    }

    const lang = language.toLowerCase();
    const languageId = languageMap[lang];

    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language: ${language}`,
      });
    }

    console.log("Executing:", {
      language: lang,
      languageId,
    });

    // 1. Create submission
    const submissionResponse = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      {
        source_code: code,
        language_id: languageId,
        stdin: stdin || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const token = submissionResponse.data.token;

    console.log("Judge0 token:", token);

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Failed to create code submission",
      });
    }

    // 2. Wait for execution
    let result;

    for (let i = 0; i < 30; i++) {
      await sleep(1000);

      const resultResponse = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
        {
          timeout: 30000,
        }
      );

      result = resultResponse.data;

      console.log("Judge0 status:", result.status);

      // Status 1 = In Queue
      // Status 2 = Processing
      if (result.status && result.status.id > 2) {
        break;
      }
    }

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "No response from Judge0",
      });
    }

    // 3. Prepare output
    const output =
      result.stdout ||
      result.stderr ||
      result.compile_output ||
      result.message ||
      result.status?.description ||
      "No output";

    console.log("Judge0 result:", result);

    return res.json({
      success: true,
      output,
    });
  } catch (error) {
    console.error(
      "Code execution error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Code execution failed",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;