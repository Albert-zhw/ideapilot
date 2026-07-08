import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AnalysisResult } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
    color: "#2f7bff",
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 24,
  },
  section: {
    marginBottom: 14,
  },
  heading: {
    fontSize: 12,
    color: "#2f7bff",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  text: {
    lineHeight: 1.6,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 12,
  },
  canvasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  canvasCell: {
    width: "50%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
  },
  canvasLabel: {
    fontSize: 9,
    color: "#6fe8ff",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  canvasValue: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

export function PdfDocument({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Document
      title={`${analysis.title} — IdeaPilot 方案`}
      author="IdeaPilot"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{analysis.title}</Text>
        <Text style={styles.subtitle}>
          由 IdeaPilot · AI 产品教练生成 ·{" "}
          {new Date().toLocaleDateString("zh-CN")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.heading}>赛道判断</Text>
          <Text style={styles.text}>{analysis.track}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>目标用户</Text>
          <Text style={styles.text}>{analysis.targetUser}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>核心痛点</Text>
          <Text style={styles.text}>{analysis.painPoint}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>MVP 功能拆解</Text>
          {analysis.mvp.map((f, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.text}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Demo 路线</Text>
          <Text style={styles.text}>{analysis.demoRoute}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>任务清单</Text>
          {analysis.tasks.map((t, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.text}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>电梯演讲</Text>
          <Text style={styles.text}>{analysis.pitch}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>项目画布</Text>
          <View style={styles.canvasGrid}>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>用户</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.user}</Text>
            </View>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>痛点</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.pain}</Text>
            </View>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>方案</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.solution}</Text>
            </View>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>MVP</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.mvp}</Text>
            </View>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>差异化</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.diff}</Text>
            </View>
            <View style={styles.canvasCell}>
              <Text style={styles.canvasLabel}>下一步</Text>
              <Text style={styles.canvasValue}>{analysis.canvas.next}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          IdeaPilot — 帮普通人把模糊想法变成可执行项目
        </Text>
      </Page>
    </Document>
  );
}
