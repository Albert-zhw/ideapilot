import { templateRepository } from "@/repositories/templateRepository";
import { AdminTemplateList } from "@/components/AdminTemplateList";
import { AdminTemplateForm } from "@/components/AdminTemplateForm";

export default async function AdminTemplatesPage() {
  const templates = await templateRepository.findAllAdmin();

  return (
    <div className="space-y-6 fade-in-up">
      <section>
        <h2 className="text-lg font-bold mb-3 opacity-80">新增赛道模板</h2>
        <div className="glass rounded-xl p-5">
          <p className="text-xs opacity-50 mb-4">
            赛道模板可作为 LLM 的 few-shot 示例，帮助 AI 更精准地理解特定品类的想法。
          </p>
          <AdminTemplateForm />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 opacity-80">
          模板列表（共 {templates.length} 条）
        </h2>
        <div className="space-y-3">
          {templates.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center opacity-60">
              暂无模板
            </div>
          ) : (
            templates.map((template) => (
              <AdminTemplateList key={template.id} template={template} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
