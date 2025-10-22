"use client"

import { SlideMenu } from "@/components/slide-menu"
import { ScanLine, TrendingUp, DollarSign, CreditCard, Calendar } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts"

const expenseByCategoryData = [
  { name: "Alimentação", value: 3450, color: "#10b981" },
  { name: "Transporte", value: 1280, color: "#f59e0b" },
  { name: "Saúde", value: 890, color: "#ef4444" },
  { name: "Lazer", value: 650, color: "#8b5cf6" },
  { name: "Outros", value: 420, color: "#6b7280" },
]

const dailySpendingData = [
  { dia: "1", gastos: 120, notas: 3 },
  { dia: "5", gastos: 280, notas: 7 },
  { dia: "10", gastos: 450, notas: 12 },
  { dia: "15", gastos: 680, notas: 18 },
  { dia: "20", gastos: 520, notas: 14 },
  { dia: "25", gastos: 380, notas: 9 },
  { dia: "30", gastos: 290, notas: 6 },
]

const paymentMethodsData = [
  { name: "PIX", value: 2850, color: "#10b981" },
  { name: "Crédito", value: 2120, color: "#3b82f6" },
  { name: "Débito", value: 1340, color: "#f59e0b" },
  { name: "Dinheiro", value: 680, color: "#6b7280" },
  { name: "Outros", value: 300, color: "#8b5cf6" },
]

export default function Dashboard() {
  const highestSpendingDay = dailySpendingData.reduce(
    (max, day) => (day.gastos > max.gastos ? day : max),
    dailySpendingData[0],
  )

  const totalSpending = expenseByCategoryData.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 bg-[#0a0e1a]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SlideMenu />
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg shadow-lg shadow-primary/20"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FiscalFlow</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Gastos Totais</p>
              <p className="text-2xl font-bold text-white">R$ {totalSpending.toFixed(2)}</p>
            </div>

            <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Método Mais Usado</p>
              <p className="text-2xl font-bold text-white">{paymentMethodsData[0].name}</p>
            </div>

            <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-amber-500/20 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Dia com Mais Gastos</p>
              <p className="text-2xl font-bold text-white">Dia {highestSpendingDay.dia}</p>
            </div>

            <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">Categoria Principal</p>
              <p className="text-2xl font-bold text-white">{expenseByCategoryData[0].name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1a2332]/60 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Gastos por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "rgba(15, 20, 25, 0.95)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#1a2332]/60 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Gastos por Dia do Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dailySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="dia"
                    stroke="#9ca3af"
                    label={{ value: "Dia", position: "insideBottom", offset: -5, fill: "#9ca3af" }}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "gastos") return [`R$ ${value.toFixed(2)}`, "Gastos"]
                      return [value, "Notas Fiscais"]
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(15, 20, 25, 0.95)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Bar dataKey="gastos" fill="#10b981" name="Gastos (R$)" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="notas" stroke="#60a5fa" strokeWidth={2} name="Notas Fiscais" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a2332]/60 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Meios de Pagamento Mais Usados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "rgba(15, 20, 25, 0.95)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#9ca3af" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
