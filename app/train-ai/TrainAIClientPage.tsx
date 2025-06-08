"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Play, BarChart3, TrendingUp, Zap, Target, Database, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import ConsultationModal from "@/components/ConsultationModal"

export default function TrainAIClientPage() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [selectedDataset, setSelectedDataset] = useState("sales")
  const [selectedModel, setSelectedModel] = useState("classification")
  const [trainingData, setTrainingData] = useState<any[]>([])
  const [results, setResults] = useState<any>(null)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const datasets = {
    sales: {
      name: "Sales Forecasting",
      description: "Predict future sales based on historical data",
      data: [
        { month: "Jan", sales: 12000, prediction: 0 },
        { month: "Feb", sales: 15000, prediction: 0 },
        { month: "Mar", sales: 18000, prediction: 0 },
        { month: "Apr", sales: 22000, prediction: 0 },
        { month: "May", sales: 25000, prediction: 0 },
        { month: "Jun", sales: 28000, prediction: 0 },
      ],
    },
    customer: {
      name: "Customer Behavior",
      description: "Classify customer segments for targeted marketing",
      data: [
        { segment: "Premium", count: 150, churn_rate: 5 },
        { segment: "Standard", count: 300, churn_rate: 12 },
        { segment: "Basic", count: 200, churn_rate: 25 },
        { segment: "Trial", count: 100, churn_rate: 45 },
      ],
    },
    financial: {
      name: "Risk Assessment",
      description: "Evaluate financial risk for loan applications",
      data: [
        { risk_level: "Low", applications: 120, approval_rate: 95 },
        { risk_level: "Medium", applications: 200, approval_rate: 75 },
        { risk_level: "High", applications: 80, approval_rate: 35 },
        { risk_level: "Very High", applications: 30, approval_rate: 10 },
      ],
    },
  }

  const models = {
    classification: {
      name: "Classification Model",
      description: "Categorize data into predefined classes",
      accuracy_range: [85, 95],
    },
    regression: {
      name: "Regression Model",
      description: "Predict continuous numerical values",
      accuracy_range: [78, 88],
    },
    clustering: {
      name: "Clustering Model",
      description: "Group similar data points together",
      accuracy_range: [82, 92],
    },
  }

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setAccuracy(0)
    setResults(null)

    // Simulate training process
    const trainingSteps = 100
    const targetAccuracy = models[selectedModel as keyof typeof models].accuracy_range[1]

    for (let i = 0; i <= trainingSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setTrainingProgress(i)
      setAccuracy(Math.min(targetAccuracy, (i / trainingSteps) * targetAccuracy + Math.random() * 5))
    }

    // Generate results
    const dataset = datasets[selectedDataset as keyof typeof datasets]
    let processedData = [...dataset.data]

    if (selectedDataset === "sales") {
      processedData = processedData.map((item) => ({
        ...item,
        prediction: item.sales * (1.1 + Math.random() * 0.2),
      }))
    }

    setResults({
      accuracy: targetAccuracy - 2 + Math.random() * 4,
      loss: 0.1 + Math.random() * 0.05,
      epochs: 50,
      training_time: "2.3 minutes",
      data: processedData,
    })

    setIsTraining(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/store" className="hover:text-blue-400 transition-colors">
                Store
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Train Your AI Model
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of AI training with our interactive simulator. Choose your dataset, select a model, and
            watch it learn in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Settings className="h-6 w-6 mr-2 text-blue-400" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Dataset</label>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger className="bg-slate-700/50 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      {Object.entries(datasets).map(([key, dataset]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{dataset.name}</div>
                            <div className="text-xs text-gray-400">{dataset.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Model Type</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-slate-700/50 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      {Object.entries(models).map(([key, model]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-gray-400">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Expected Accuracy:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {models[selectedModel as keyof typeof models].accuracy_range[0]}-
                      {models[selectedModel as keyof typeof models].accuracy_range[1]}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Training Time:</span>
                    <span className="text-sm text-blue-400">~5 seconds</span>
                  </div>
                </div>

                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50"
                >
                  {isTraining ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Training...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Training Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="training" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="training" className="data-[state=active]:bg-purple-600">
                  <Brain className="h-4 w-4 mr-2" />
                  Training
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-purple-600">
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-purple-600">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                      Training Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-blue-400">{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">{accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-gray-300">Current Accuracy</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">
                          {isTraining ? Math.floor(trainingProgress / 2) : 0}
                        </div>
                        <div className="text-sm text-gray-300">Epochs Completed</div>
                      </div>
                    </div>

                    {isTraining && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-yellow-400">
                          <Brain className="h-5 w-5 animate-pulse" />
                          <span>AI is learning from your data...</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Database className="h-6 w-6 mr-2 text-green-400" />
                      Dataset: {datasets[selectedDataset as keyof typeof datasets].name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-6">
                      {datasets[selectedDataset as keyof typeof datasets].description}
                    </p>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        {selectedDataset === "sales" ? (
                          <LineChart data={datasets[selectedDataset].data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #6366F1",
                                borderRadius: "8px",
                              }}
                            />
                            <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} />
                          </LineChart>
                        ) : (
                          <BarChart data={datasets[selectedDataset as keyof typeof datasets].data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                              dataKey={Object.keys(datasets[selectedDataset as keyof typeof datasets].data[0])[0]}
                              stroke="#9CA3AF"
                            />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #6366F1",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar
                              dataKey={Object.keys(datasets[selectedDataset as keyof typeof datasets].data[0])[1]}
                              fill="#8B5CF6"
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                {results ? (
                  <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Target className="h-6 w-6 mr-2 text-green-400" />
                        Training Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-400">{results.accuracy.toFixed(1)}%</div>
                          <div className="text-sm text-gray-300">Final Accuracy</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-400">{results.loss.toFixed(3)}</div>
                          <div className="text-sm text-gray-300">Loss</div>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-400">{results.epochs}</div>
                          <div className="text-sm text-gray-300">Epochs</div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-400">{results.training_time}</div>
                          <div className="text-sm text-gray-300">Training Time</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Model Performance</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            {selectedDataset === "sales" ? (
                              <LineChart data={results.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #6366F1",
                                    borderRadius: "8px",
                                  }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} name="Actual" />
                                <Line
                                  type="monotone"
                                  dataKey="prediction"
                                  stroke="#F59E0B"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  name="Predicted"
                                />
                              </LineChart>
                            ) : (
                              <BarChart data={results.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey={Object.keys(results.data[0])[0]} stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #6366F1",
                                    borderRadius: "8px",
                                  }}
                                />
                                <Bar dataKey={Object.keys(results.data[0])[1]} fill="#8B5CF6" />
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Deploy Model
                        </Button>
                        <Button
                          variant="outline"
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                        >
                          Export Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
                      <p className="text-gray-300">
                        Start training your AI model to see detailed results and performance metrics.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready for Professional AI Training?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                This is just a taste of what's possible. Get professional AI training services tailored to your specific
                business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                    Browse AI Services
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsConsultationOpen(true)}
                  variant="outline"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                >
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </div>
  )
}
