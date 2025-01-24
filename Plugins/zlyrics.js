const { zokou } = require('../framework/zokou');
const lyricsFinder = require('lyrics-finder');
const axios = require("axios");
const yts = require('yt-search');

zokou({
    nomCom: 'lyrics',
    aliases: ['lyric', 'mistari'],
    reaction: '📑',
    categorie: "search"
}, async (dest, zk, params) => {
  const { repondre: sendResponse, arg: commandArgs, ms } = params;
  const text = commandArgs.join(" ").trim();

  if (!text) {
    return sendResponse("Yoh if you want a lyrics give me your song name and artist 👊 unyama sana.");
  }

  // Function to get lyrics data from APIs
  const getLyricsData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return null;
    }
  };

  // List of APIs to try
  const apis = [
    `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(text)}`,
    `https://some-random-api.com/others/lyrics?title=${encodeURIComponent(text)}`,
    `https://api.davidcyriltech.my.id/lyrics?title=${encodeURIComponent(text)}`
  ];

  let lyricsData;
  for (const api of apis) {
    lyricsData = await getLyricsData(api);
    if (lyricsData && lyricsData.result && lyricsData.result.lyrics) break;
  }

  // Check if lyrics data was found
  if (!lyricsData || !lyricsData.result || !lyricsData.result.lyrics) {
    return sendResponse(`Failed to dowload this song lyrics please try another song⁉️.`);
  }

    const { title, artist, thumb, lyrics } = lyricsData.result;
  const imageUrl = thumb || "https://files.catbox.moe/b2vql7.jpg";
    
        // Format the message to send to the user
        const caption = `
*LUCKY MD PLANET LYRICS FINDER*
*Title:* ${title}
*Artist:* ${artist}

${lyrics}`;

try {
    // Fetch the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Send the message with the image and lyrics
    await zk.sendMessage(
      dest,
      {
        image: imageBuffer,
        caption: caption
      },
      { quoted: ms }
    );

  } catch (error) {
    console.error('Error fetching or sending image:', error);
    // Fallback to sending just the text if image fetch fails
    await sendResponse(caption);
  }
});
