import axios from "axios";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function searchToMarkdownOutline(query: string): Promise<string> {
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === "YOUR_DEEPSEEK_API_KEY") {
    throw new Error("DeepSeek API Key 未配置，请在环境变量中设置 VITE_DEEPSEEK_API_KEY");
  }

  const prompt = `请根据以下主题生成一份结构化的Markdown大纲，适合用于思维导图，内容简明扼要：\n\n主题：${query}\n\nMarkdown大纲：`;
  
  try {
    const res = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 30000, // 30秒超时
      }
    );
    
    if (!res.data?.choices?.[0]?.message?.content) {
      throw new Error("API 返回数据格式异常");
    }
    
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API 调用失败:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("API Key 无效或已过期");
      } else if (error.response?.status === 429) {
        throw new Error("API 调用频率超限，请稍后重试");
      } else if (error.code === "ECONNABORTED") {
        throw new Error("请求超时，请检查网络连接");
      }
    }
    throw new Error("AI 服务暂时不可用，请稍后重试");
  }
} 