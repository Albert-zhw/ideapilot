import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero 区 */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 pulse-ring" />
            <div
              className="absolute inset-0 rounded-full border border-violet-400/30 pulse-ring"
              style={{ animationDelay: "0.7s" }}
            />
            <div
              className="absolute inset-0 rounded-full border border-blue-400/30 pulse-ring"
              style={{ animationDelay: "1.4s" }}
            />
            <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-xl" />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            把 <span className="gradient-text">&ldquo;我有个想法&rdquo;</span>
            <br />
            变成 <span className="gradient-text">&ldquo;我可以开始做了&rdquo;</span>
          </h1>
          <p className="text-lg opacity-70 mb-8 max-w-xl mx-auto">
            每个人脑子里都闪过好想法，但 99% 死在&ldquo;然后呢&rdquo;。
            IdeaPilot 是一位 AI 产品教练，输入一句模糊想法，自动拆成赛道、用户、痛点、MVP、任务、画布。
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/workspace"
              className="gradient-btn px-6 py-3 rounded-lg text-sm"
            >
              进入工作台
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 transition text-sm"
            >
              登录
            </Link>
          </div>
        </div>
      </section>

      {/* 功能区 */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          一句模糊想法 → 一份可执行方案
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "赛道判断",
              desc: "AI 自动识别想法属于哪个赛道，说清为什么。",
            },
            {
              icon: "👤",
              title: "锁定用户",
              desc: "精准定位目标人群，不写'所有人'。",
            },
            {
              icon: "💥",
              title: "说清痛点",
              desc: "一句话说清用户到底卡在哪里。",
            },
            {
              icon: "📦",
              title: "拆出 MVP",
              desc: "恰好 4 个核心功能，不多不少，可直接动手。",
            },
            {
              icon: "📋",
              title: "任务清单",
              desc: "4 条可立即执行的任务，从今天开始。",
            },
            {
              icon: "🖼️",
              title: "项目画布",
              desc: "六格画布一屏看清，电梯演讲直接可用。",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm opacity-60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-4">现在就开始</h2>
          <p className="opacity-60 mb-6">
            输入一句想法，30 秒拿到一份结构化方案。
          </p>
          <Link
            href="/workspace"
            className="inline-block gradient-btn px-8 py-3 rounded-lg"
          >
            进入工作台
          </Link>
        </div>
      </section>
    </div>
  );
}
