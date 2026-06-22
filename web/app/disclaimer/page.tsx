import { AlertTriangle, Scale, Shield, Users } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/10 text-warning mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">免责声明</h1>
        <p className="text-muted">使用 ProxieHub 前，请务必仔细阅读以下条款。</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">项目性质</h2>
          </div>
          <p className="text-muted leading-relaxed">
            ProxieHub 是一个开源的教育研究项目，旨在帮助用户学习网络协议、安全测试和隐私技术。
            本项目不生产、不运营任何代理或 VPN 节点，所有节点和代理列表均来自互联网公开渠道。
            我们仅对公开数据进行格式转换、聚合与再分发。
          </p>
        </section>

        <section className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">安全与隐私风险</h2>
          </div>
          <ul className="space-y-3 text-muted leading-relaxed list-disc list-inside">
            <li>免费公开节点不保证可用性、稳定性、安全性与隐私性。</li>
            <li>节点运营者可能查看、记录、篡改或注入你的网络流量。</li>
            <li>部分节点可能是蜜罐、钓鱼或恶意服务器，存在数据泄露风险。</li>
            <li>使用免费节点时，请勿登录银行、支付、社交、邮箱等敏感账户。</li>
            <li>请勿通过免费节点传输个人隐私、商业机密或受法律保护的信息。</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">用户责任</h2>
          </div>
          <ul className="space-y-3 text-muted leading-relaxed list-disc list-inside">
            <li>用户应自行判断节点来源的可信度，并承担使用风险。</li>
            <li>用户应遵守所在国家/地区的法律法规，合法使用本项目。</li>
            <li>未成年人应在监护人指导下使用本项目。</li>
            <li>项目维护者不对任何直接或间接损失承担责任。</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-warning/10 border border-warning/20 p-6">
          <h2 className="text-xl font-bold text-warning mb-4">法律合规提示</h2>
          <p className="text-muted leading-relaxed">
            在某些司法管辖区，使用、分发或提供代理/VPN 节点可能受到限制。请在使用前了解并遵守当地法律。
            如果你发现本项目中包含侵犯你权益或违反法律的内容，请通过 GitHub Issues 联系我们，我们将尽快处理。
          </p>
        </section>
      </div>
    </div>
  );
}
