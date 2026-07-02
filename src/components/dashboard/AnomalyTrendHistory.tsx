import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Activity,
  Flame,
  ChevronDown,
  BarChart3,
  Zap,
  Clock,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useAnomalyTrend } from '@/hooks/use-anomaly-history'
import { CATEGORY_CONFIG, type TechCategory } from '@/lib/tech-categories'
import { format, parseISO } from 'date-fns'

interface TooltipPayloadItem {
  payload: {
    date: string
    count: number
    avgImpact: number
    topAnomaly: {
      title: string
      category: string
      impactScore: number
    } | null
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
}

interface AnomalyTrendHistoryProps {
  className?: string
}

export function AnomalyTrendHistory({
  className = '',
}: AnomalyTrendHistoryProps) {
  const { language } = useLanguage()
  const [selectedDays, setSelectedDays] = useState(30)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  )
  const [showDaysDropdown, setShowDaysDropdown] = useState(false)

  const { trends, summary, isLoading } = useAnomalyTrend({
    days: selectedDays,
    category: selectedCategory,
  })

  // Calculate trend direction
  const trendDirection = useMemo(() => {
    if (trends.length < 7) return 'stable'

    const recentWeek = trends.slice(-7)
    const previousWeek = trends.slice(-14, -7)

    const recentAvg =
      recentWeek.reduce((sum, d) => sum + d.count, 0) / recentWeek.length
    const previousAvg =
      previousWeek.length > 0
        ? previousWeek.reduce((sum, d) => sum + d.count, 0) /
          previousWeek.length
        : recentAvg

    const change = ((recentAvg - previousAvg) / (previousAvg || 1)) * 100

    if (change > 20) return 'rising'
    if (change < -20) return 'falling'
    return 'stable'
  }, [trends])

  // Format chart data
  const chartData = useMemo(() => {
    return trends.map((t) => ({
      ...t,
      dateLabel: format(parseISO(t.date), 'MMM d'),
      shortDate: format(parseISO(t.date), 'd'),
    }))
  }, [trends])

  // Get top categories
  const topCategories = useMemo(() => {
    return Object.entries(summary.categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [summary.categoryTotals])

  const dayOptions = [
    { value: 7, label: language === 'ru' ? '7 дней' : '7 days' },
    { value: 14, label: language === 'ru' ? '14 дней' : '14 days' },
    { value: 30, label: language === 'ru' ? '30 дней' : '30 days' },
    { value: 60, label: language === 'ru' ? '60 дней' : '60 days' },
    { value: 90, label: language === 'ru' ? '90 дней' : '90 days' },
  ]

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="bg-[#0a0a0f]/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl">
        <p className="text-sm font-medium text-white mb-2">
          {format(parseISO(data.date), 'MMMM d, yyyy')}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/70">
              {language === 'ru' ? 'Аномалий:' : 'Anomalies:'}
            </span>
            <span className="text-sm font-bold text-amber-400">
              {data.count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">
              {language === 'ru' ? 'Ср. влияние:' : 'Avg Impact:'}
            </span>
            <span className="text-sm font-bold text-cyan-400">
              {data.avgImpact}
            </span>
          </div>
          {data.topAnomaly && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-white/50 mb-1">
                {language === 'ru' ? 'Топ аномалия:' : 'Top anomaly:'}
              </p>
              <p className="text-xs text-white/80 line-clamp-2">
                {data.topAnomaly.title}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-[#0a0a0f]/80 border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/5 via-orange-500/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {language === 'ru'
                  ? 'История аномалий'
                  : 'Anomaly Trend History'}
              </h3>
              <p className="text-xs text-white/50">
                {language === 'ru'
                  ? 'Отслеживание необычной активности'
                  : 'Tracking unusual activity patterns'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Category filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="">
                {language === 'ru' ? 'Все категории' : 'All categories'}
              </option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>

            {/* Days selector */}
            <div className="relative">
              <button
                onClick={() => setShowDaysDropdown(!showDaysDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {dayOptions.find((d) => d.value === selectedDays)?.label}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showDaysDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-32 bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden z-10 shadow-xl"
                  >
                    {dayOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedDays(option.value)
                          setShowDaysDropdown(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          selectedDays === option.value
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <motion.div
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-white/50">
                {language === 'ru' ? 'Всего' : 'Total'}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? '—' : summary.totalAnomalies}
            </p>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/50">
                {language === 'ru' ? 'В среднем/день' : 'Avg/day'}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? '—' : summary.avgPerDay}
            </p>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-white/50">
                {language === 'ru' ? 'Пик' : 'Peak'}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? '—' : summary.peakCount}
            </p>
            {summary.peakDay && (
              <p className="text-xs text-white/40 mt-1">
                {format(parseISO(summary.peakDay), 'MMM d')}
              </p>
            )}
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {trendDirection === 'rising' ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : trendDirection === 'falling' ? (
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              ) : (
                <Activity className="w-4 h-4 text-white/40" />
              )}
              <span className="text-xs text-white/50">
                {language === 'ru' ? 'Тренд' : 'Trend'}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                trendDirection === 'rising'
                  ? 'text-red-400'
                  : trendDirection === 'falling'
                    ? 'text-emerald-400'
                    : 'text-white/60'
              }`}
            >
              {trendDirection === 'rising'
                ? language === 'ru'
                  ? '↑ Рост'
                  : '↑ Rising'
                : trendDirection === 'falling'
                  ? language === 'ru'
                    ? '↓ Спад'
                    : '↓ Falling'
                  : language === 'ru'
                    ? '→ Стабильно'
                    : '→ Stable'}
            </p>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="h-64 mb-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-sm text-white/40">
                  {language === 'ru' ? 'Загрузка данных...' : 'Loading data...'}
                </p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">
                  {language === 'ru'
                    ? 'Нет данных за выбранный период'
                    : 'No data for selected period'}
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="anomalyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="dateLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#anomalyGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: '#f59e0b',
                    stroke: '#0a0a0f',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category breakdown */}
        {topCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-3">
              {language === 'ru' ? 'По категориям' : 'By Category'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {topCategories.map(([category, count], index) => {
                const config = CATEGORY_CONFIG[category as TechCategory]
                return (
                  <motion.button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category ? undefined : category,
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'ring-2 ring-amber-500/50'
                        : ''
                    }`}
                    style={{
                      backgroundColor: `${config?.color}15`,
                      color: config?.color,
                      borderColor: `${config?.color}30`,
                      borderWidth: 1,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{config?.icon}</span>
                    <span>{config?.label || category}</span>
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px]"
                      style={{
                        backgroundColor: `${config?.color}30`,
                      }}
                    >
                      {count}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!isLoading && summary.totalAnomalies === 0 && (
          <motion.div
            className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Clock className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">
              {language === 'ru'
                ? 'Аномалии будут записываться автоматически при обнаружении'
                : 'Anomalies will be recorded automatically when detected'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
