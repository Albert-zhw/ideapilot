import { PrismaClient, Role, IdeaStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始种子数据...");

  // 1. 管理员账号
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ideapilot.app" },
    update: {},
    create: {
      email: "admin@ideapilot.app",
      passwordHash: adminPassword,
      name: "管理员",
      role: Role.ADMIN,
    },
  });
  console.log(`管理员账号: ${admin.email} (密码: admin123456)`);

  // 2. 测试普通用户
  const userPassword = await bcrypt.hash("user123456", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@ideapilot.app" },
    update: {},
    create: {
      email: "demo@ideapilot.app",
      passwordHash: userPassword,
      name: "体验用户",
      role: Role.USER,
    },
  });
  console.log(`体验账号: ${demoUser.email} (密码: user123456)`);

  // 3. 5 个赛道模板（LLM few-shot 示例）
  const templates = [
    {
      track: "社会服务",
      exampleInput: "我想做个帮视障者导航最后 20 米的 App",
      exampleOutput: JSON.stringify({
        track: "社会服务·无障碍",
        targetUser: "视障者（全盲/低视力）独立出行的最后一段路程",
        painPoint: "导航到目的地附近后失灵，最后 20 米盲道被占、入口难找",
        mvp: ["AI 环境扫描", "语音路线引导", "风险提醒", "公益反馈"],
        demoRoute: "首页→选场景→AI 扫描→语音引导→抵达反馈",
        tasks: ["设计场景数据结构", "实现语音播报", "接入视觉识别", "搭建公益看板"],
        pitch: "LightPath 光径，为视障者点亮最后 20 米的方向。",
      }),
    },
    {
      track: "学习工作",
      exampleInput: "学生错题智能复习",
      exampleOutput: JSON.stringify({
        track: "学习工作·教育",
        targetUser: "初高中学生，理科错题多、复习无章法",
        painPoint: "错题只抄不练，同类题反复错，复习效率低",
        mvp: ["错题拍照入库", "知识点标签", "间隔复习算法", "同类题推荐"],
        demoRoute: "拍照→识别→打标签→复习提醒→同类题练习",
        tasks: ["接入 OCR", "构建知识图谱", "实现 SM-2 算法", "设计复习日历"],
        pitch: "错题不再抄完就忘，AI 帮你按记忆曲线精准复习。",
      }),
    },
    {
      track: "生活娱乐",
      exampleInput: "帮独居老人每天打个招呼的智能音箱",
      exampleOutput: JSON.stringify({
        track: "生活娱乐·适老化",
        targetUser: "独居老人，子女不在身边，缺乏日常交流",
        painPoint: "孤独感强，智能设备不会用，紧急情况无人知",
        mvp: ["每日问候", "语音聊天", "用药提醒", "异常预警通知子女"],
        demoRoute: "开机→问候→聊天→提醒→异常推送子女",
        tasks: ["设计问候库", "接入语音助手", "实现提醒系统", "搭建预警推送"],
        pitch: "一个会主动关心的音箱，让独居不再孤独。",
      }),
    },
    {
      track: "效率工具",
      exampleInput: "把会议录音直接变成行动清单",
      exampleOutput: JSON.stringify({
        track: "效率工具·协作",
        targetUser: "职场人，会议多、会后行动跟进难",
        painPoint: "会后纪要靠人工整理，行动项无人跟踪，落地率低",
        mvp: ["录音转写", "行动项抽取", "负责人分配", "进度跟踪"],
        demoRoute: "上传录音→转写→抽取行动→分配→跟踪看板",
        tasks: ["接入语音转写", "实现行动抽取", "设计看板", "集成通知"],
        pitch: "会后 5 分钟，行动清单自动到人。",
      }),
    },
    {
      track: "通用",
      exampleInput: "一个帮人坚持养成习惯的 App",
      exampleOutput: JSON.stringify({
        track: "通用·个人成长",
        targetUser: "想养成好习惯但总是三分钟热度的成年人",
        painPoint: "开始容易坚持难，缺乏正反馈和社交监督",
        mvp: ["习惯打卡", "连胜机制", "好友监督", "数据可视化"],
        demoRoute: "设定习惯→每日打卡→连胜激励→好友互动",
        tasks: ["设计打卡模型", "实现连胜算法", "搭建好友系统", "生成统计图表"],
        pitch: "把三分钟热度，变成 21 天的习惯。",
      }),
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { track: t.track },
      update: {},
      create: t,
    });
  }
  console.log(`已创建 ${templates.length} 个赛道模板`);

  // 4. 标签
  const tags = [
    { name: "社会服务", color: "#6fe8ff" },
    { name: "学习工作", color: "#2f7bff" },
    { name: "生活娱乐", color: "#a66bff" },
    { name: "效率工具", color: "#ff6f9c" },
    { name: "通用", color: "#6fff8e" },
  ];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
  console.log(`已创建 ${tags.length} 个标签`);

  // 5. 示例想法 + 分析结果（用于未登录预览）
  const sampleIdea = await prisma.idea.create({
    data: {
      userId: demoUser.id,
      rawText: "我想做个帮视障者导航最后 20 米的 App",
      title: "最后 20 米导航",
      status: IdeaStatus.ANALYZED,
      analysis: {
        create: {
          track: "社会服务·无障碍",
          targetUser: "视障者（全盲/低视力）独立出行的最后一段路程",
          painPoint: "导航到目的地附近后失灵，最后 20 米盲道被占、入口难找",
          mvp: JSON.stringify(["AI 环境扫描", "语音路线引导", "风险提醒", "公益反馈"]),
          demoRoute: "首页→选场景→AI 扫描→语音引导→抵达反馈",
          tasks: JSON.stringify(["设计场景数据结构", "实现语音播报", "接入视觉识别", "搭建公益看板"]),
          pitch: "LightPath 光径，为视障者点亮最后 20 米的方向。",
          canvas: JSON.stringify({
            user: "视障者",
            pain: "最后 20 米失灵",
            solution: "AI 环境扫描 + 语音引导",
            mvp: "扫描+语音+提醒+反馈",
            diff: "聚焦最后 20 米",
            next: "4 场景跑通闭环",
          }),
          title: "最后 20 米导航",
          tags: JSON.stringify(["社会服务"]),
          modelUsed: "seed-mock",
          tokensUsed: 0,
        },
      },
    },
    include: { analysis: true },
  });

  // 关联标签
  const societyTag = await prisma.tag.findUnique({ where: { name: "社会服务" } });
  if (societyTag) {
    await prisma.ideaTag.create({
      data: { ideaId: sampleIdea.id, tagId: societyTag.id },
    });
  }
  console.log(`已创建示例想法: ${sampleIdea.title}`);

  console.log("种子数据完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
