import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Transformer } from "markmap-lib";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";

// 使用ES模块导入Markmap
import * as markmapView from "markmap-view";
const Markmap = (markmapView as unknown as { Markmap: unknown }).Markmap as unknown as new (...args: unknown[]) => MarkmapInstance;

interface Props {
  markdown: string;
  showDownloadBtn?: boolean;
}

interface MindMapEditorRef {
  downloadSvg: () => void;
  downloadPng: () => void;
  downloadJpg: () => void;
  downloadXmind: () => void;
}

interface MarkmapInstance {
  fit: () => void;
  setData: (data: unknown) => void;
}

interface XMindTopic {
  title: string;
  children: {
    attached: XMindTopic[];
  };
}

const transformer = new Transformer();

const MindMapEditor = forwardRef<MindMapEditorRef, Props>(({ markdown, showDownloadBtn }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapInstance = useRef<MarkmapInstance | null>(null);

  // 下载菜单
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // 导出方法
  const downloadSvg = () => {
    try {
      if (svgRef.current && markmapInstance.current) {
        // 先适应所有内容
        markmapInstance.current.fit();
        
        // 等待渲染完成
        setTimeout(() => {
          // 获取SVG的实际尺寸，大幅增加边距确保文本不被遮挡
          const svgElement = svgRef.current!;
          const bbox = svgElement.getBBox();
          
          // 大幅增加边距，确保文本有足够空间
          const padding = 600; // 从400增加到600
          const width = Math.max(bbox.width + padding * 2, 2400); // 从2000增加到2400
          const height = Math.max(bbox.height + padding * 2, 2000); // 从1600增加到2000
          
          // 创建新的SVG元素，确保包含所有内容
          const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          newSvg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
          newSvg.setAttribute('width', width.toString());
          newSvg.setAttribute('height', height.toString());
          newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          
          // 复制原始SVG的所有子元素
          Array.from(svgElement.children).forEach(child => {
            newSvg.appendChild(child.cloneNode(true));
          });
          
          // 添加高质量样式，确保文本清晰可见且不被遮挡
          const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          style.textContent = `
            .markmap-node { cursor: pointer; }
            .markmap-link { fill: none; stroke-width: 3; }
            .markmap-node-text { 
              fill: #333; 
              font-size: 20px; 
              font-family: Arial, sans-serif; 
              font-weight: 600;
              text-anchor: middle;
              dominant-baseline: middle;
              paint-order: stroke;
              stroke: #fff;
              stroke-width: 4px;
              stroke-linejoin: round;
              stroke-linecap: round;
            }
            .markmap-node-icon { fill: #666; }
            .markmap-node-circle { 
              fill: #fff; 
              stroke: #333; 
              stroke-width: 3; 
              r: 12;
            }
            .markmap-node-line { 
              stroke: #333; 
              stroke-width: 3; 
            }
            .markmap-node-tspan {
              font-size: 20px;
              font-weight: 600;
              paint-order: stroke;
              stroke: #fff;
              stroke-width: 4px;
              stroke-linejoin: round;
              stroke-linecap: round;
            }
            .markmap-node-tspan tspan {
              font-size: 20px;
              font-weight: 600;
              paint-order: stroke;
              stroke: #fff;
              stroke-width: 4px;
              stroke-linejoin: round;
              stroke-linecap: round;
            }
            /* 确保所有文本元素都有足够的描边 */
            text {
              paint-order: stroke;
              stroke: #fff;
              stroke-width: 4px;
              stroke-linejoin: round;
              stroke-linecap: round;
            }
            /* 处理多行文本 */
            tspan {
              paint-order: stroke;
              stroke: #fff;
              stroke-width: 4px;
              stroke-linejoin: round;
              stroke-linecap: round;
            }
          `;
          newSvg.appendChild(style);
          
          const svgData = new XMLSerializer().serializeToString(newSvg);
          const blob = new Blob([svgData], { type: "image/svg+xml" });
          saveAs(blob, "mindmap.svg");
          console.log('SVG导出成功，超高质量尺寸:', width, 'x', height, '边界框:', bbox);
        }, 300);
      }
    } catch (error) {
      console.error('SVG导出失败:', error);
    }
  };

  const downloadPng = async () => {
    try {
      if (svgRef.current && markmapInstance.current) {
        // 先适应所有内容
        markmapInstance.current.fit();
        
        // 等待渲染完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 获取SVG的实际尺寸
        const svgElement = svgRef.current;
        const bbox = svgElement.getBBox();
        const padding = 300; // 增加边距避免文本被裁剪
        const width = Math.max(bbox.width + padding * 2, 1600);
        const height = Math.max(bbox.height + padding * 2, 1200);
        
        console.log('PNG导出 - SVG边界框:', bbox);
        console.log('PNG导出 - 尺寸:', width, 'x', height);
        
        // 使用4倍分辨率确保超高清晰度
        const dataUrl = await toPng(svgElement as unknown as HTMLElement, {
          backgroundColor: '#fff',
          width: width * 4,
          height: height * 4,
          style: {
            transform: 'scale(4)',
            transformOrigin: 'top left'
          }
        });
        
        saveAs(dataUrl, "mindmap.png");
        console.log('PNG导出成功，超高清尺寸:', width * 4, 'x', height * 4);
      }
    } catch (error) {
      console.error('PNG导出失败:', error);
    }
  };

  const downloadJpg = async () => {
    try {
      if (svgRef.current && markmapInstance.current) {
        // 先适应所有内容
        markmapInstance.current.fit();
        
        // 等待渲染完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 获取SVG的实际尺寸
        const svgElement = svgRef.current;
        const bbox = svgElement.getBBox();
        const padding = 300; // 增加边距避免文本被裁剪
        const width = Math.max(bbox.width + padding * 2, 1600);
        const height = Math.max(bbox.height + padding * 2, 1200);
        
        console.log('JPG导出 - SVG边界框:', bbox);
        console.log('JPG导出 - 尺寸:', width, 'x', height);
        
        // 使用4倍分辨率确保超高清晰度
        const dataUrl = await toJpeg(svgElement as unknown as HTMLElement, {
          backgroundColor: '#fff',
          width: width * 4,
          height: height * 4,
          quality: 1.0, // 最高质量
          style: {
            transform: 'scale(4)',
            transformOrigin: 'top left'
          }
        });
        
        saveAs(dataUrl, "mindmap.jpg");
        console.log('JPG导出成功，超高清尺寸:', width * 4, 'x', height * 4);
      }
    } catch (error) {
      console.error('JPG导出失败:', error);
    }
  };

  const downloadXmind = () => {
    try {
      // 创建XMind格式的数据
      const xmindData = {
        rootTopic: {
          title: "思维导图",
          children: {
            attached: []
          }
        }
      };

      // 将Markdown转换为XMind结构
      const lines = markdown.split('\n');
      const stack: XMindTopic['children']['attached'][] = [xmindData.rootTopic.children.attached];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 计算层级
        const level = (line.match(/^(\s*)/)?.[1].length || 0) / 2;
        const content = trimmedLine.replace(/^[-*+]\s*/, '');

        if (content) {
          const topic: XMindTopic = { title: content, children: { attached: [] } };

          // 根据层级添加到正确位置
          while (stack.length > level + 1) {
            stack.pop();
          }

          if (stack.length === level + 1) {
            stack[stack.length - 1].push(topic);
            stack.push(topic.children.attached);
          }
        }
      }

      // 转换为XMind文件格式
      const xmindContent = JSON.stringify(xmindData, null, 2);
      const blob = new Blob([xmindContent], { type: "application/json" });
      saveAs(blob, "mindmap.xmind");
      console.log('XMind导出成功');
    } catch (error) {
      console.error('XMind导出失败:', error);
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    downloadSvg,
    downloadPng,
    downloadJpg,
    downloadXmind
  }));

  useEffect(() => {
    if (svgRef.current && markdown) {
      try {
        // 转换Markdown为思维导图数据
        const { root } = transformer.transform(markdown);
        
        // 创建或更新Markmap实例
        if (!markmapInstance.current) {
          markmapInstance.current = new Markmap(svgRef.current, {
            autoFit: true,
            zoom: {
              minScale: 0.1,
              maxScale: 3
            }
          });
        }
        
        // 设置数据
        if (markmapInstance.current) {
          markmapInstance.current.setData(root);
        }
      } catch (error) {
        console.error('思维导图渲染失败:', error);
      }
    }
  }, [markdown]);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
      {showDownloadBtn && (
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <Button
            onClick={handleMenuClick}
            variant="contained"
            size="small"
            sx={{ bgcolor: "#1976d2", color: "#fff" }}
          >
            下载
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => { downloadSvg(); handleMenuClose(); }}>SVG</MenuItem>
            <MenuItem onClick={() => { downloadPng(); handleMenuClose(); }}>PNG</MenuItem>
            <MenuItem onClick={() => { downloadJpg(); handleMenuClose(); }}>JPG</MenuItem>
            <MenuItem onClick={() => { downloadXmind(); handleMenuClose(); }}>XMind</MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
});

MindMapEditor.displayName = 'MindMapEditor';

export default MindMapEditor; 