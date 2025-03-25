const axios = require('axios');

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;

const scanFood = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        const response = await axios.post(
            `${AZURE_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags`,
            req.file.buffer,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
                    'Content-Type': 'application/octet-stream'
                }
            }
        );

        const tags = response.data.tags
            .filter(tag => tag.name.toLowerCase().includes('food') || tag.confidence > 0.7)
            .map(tag => ({
                description: tag.name,
                confidence: tag.confidence
            }));

        res.json({ tags });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
};


module.exports = {
    scanFood,
}
