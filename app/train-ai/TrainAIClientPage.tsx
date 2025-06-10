"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  Play,
  BarChart3,
  TrendingUp,
  Zap,
  Target,
  Database,
  Settings,
  RefreshCcw,
  LogIn,
  Upload,
  Download,
  MessageSquare,
  Layers,
  Sparkles,
  RotateCw,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TrainAIClientPageProps {
  initialUser?: User | null
  authAttempted?: boolean
  authError?: boolean
}

export default function TrainAIClientPage({ initialUser, authAttempted, authError }: TrainAIClientPageProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [selectedDataset, setSelectedDataset] = useState("sales")
  const [selectedModel, setSelectedModel] = useState("classification")
  const [trainingData, setTrainingData] = useState<any[]>([])
  const [results, setResults] = useState<any>(null)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [forceShow, setForceShow] = useState(false)
  const [redirectAttempts, setRedirectAttempts] = useState(0)
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null)
  const [activeTab, setActiveTab] = useState("training")
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "I'm your AI assistant for model training. How can I help you today?" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [customDatasetName, setCustomDatasetName] = useState("")
  const [customDatasetDescription, setCustomDatasetDescription] = useState("")
  const [customDatasetFile, setCustomDatasetFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [advancedOptions, setAdvancedOptions] = useState(false)
  const [hyperparameters, setHyperparameters] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 50,
    dropout: 0.2,
    optimizer: "adam",
  })
  const [selectedPretrainedModel, setSelectedPretrainedModel] = useState("bert")
  const [isInferenceRunning, setIsInferenceRunning] = useState(false)
  const [inferenceInput, setInferenceInput] = useState("")
  const [inferenceResult, setInferenceResult] = useState<any>(null)
  const [modelArchitecture, setModelArchitecture] = useState("standard")
  const [useAutoML, setUseAutoML] = useState(false)
  const [isModelExporting, setIsModelExporting] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // If auth was attempted or there was an auth error, force show the page
  useEffect(() => {
    if (authAttempted || authError) {
      setForceShow(true)
    }
  }, [authAttempted, authError])

  // Handle auth redirects
  useEffect(() => {
    // Clear any existing timeout
    if (redirectTimeout) {
      clearTimeout(redirectTimeout)
    }

    // Skip checks if we're forcing the page to show
    if (forceShow) {
      return
    }

    // Only check auth after loading is complete
    if (!authLoading) {
      if (!user && !initialUser) {
        console.log("No user found, redirecting to auth")
        const timeout = setTimeout(() => {
          router.push("/auth?redirect=train-ai")
        }, 1000)
        setRedirectTimeout(timeout)
        setRedirectAttempts((prev) => prev + 1)
      }
    }
  }, [authLoading, user, initialUser, router, forceShow, redirectTimeout])

  // Safety mechanism to prevent infinite redirects
  useEffect(() => {
    if (redirectAttempts > 3) {
      console.log("Too many redirect attempts, forcing page to show")
      setForceShow(true)
    }
  }, [redirectAttempts])

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

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
    nlp: {
      name: "Text Classification",
      description: "Analyze sentiment and categorize text data",
      data: [
        { category: "Positive", count: 450, accuracy: 92 },
        { category: "Neutral", count: 320, accuracy: 85 },
        { category: "Negative", count: 230, accuracy: 88 },
      ],
    },
    image: {
      name: "Image Recognition",
      description: "Identify objects and patterns in images",
      data: [
        { category: "People", count: 520, accuracy: 94 },
        { category: "Products", count: 380, accuracy: 91 },
        { category: "Places", count: 290, accuracy: 87 },
        { category: "Animals", count: 210, accuracy: 89 },
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
    transformer: {
      name: "Transformer Model",
      description: "Advanced NLP model with attention mechanisms",
      accuracy_range: [90, 98],
    },
    cnn: {
      name: "Convolutional Neural Network",
      description: "Deep learning model for image processing",
      accuracy_range: [88, 96],
    },
  }

  const pretrainedModels = [
    {
      id: "bert",
      name: "BERT",
      description: "Bidirectional Encoder Representations from Transformers",
      type: "NLP",
      parameters: "110M",
    },
    { id: "gpt2", name: "GPT-2", description: "Generative Pre-trained Transformer 2", type: "NLP", parameters: "1.5B" },
    {
      id: "resnet",
      name: "ResNet-50",
      description: "Residual Network for image recognition",
      type: "Vision",
      parameters: "25M",
    },
    {
      id: "vit",
      name: "Vision Transformer",
      description: "Transformer model for image classification",
      type: "Vision",
      parameters: "86M",
    },
    {
      id: "roberta",
      name: "RoBERTa",
      description: "Robustly optimized BERT approach",
      type: "NLP",
      parameters: "125M",
    },
  ]

  const architectureOptions = [
    { id: "standard", name: "Standard", description: "Basic neural network architecture" },
    { id: "residual", name: "Residual", description: "With skip connections for deeper networks" },
    { id: "attention", name: "Attention-based", description: "Using attention mechanisms" },
    { id: "ensemble", name: "Ensemble", description: "Combining multiple models" },
  ]

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setAccuracy(0)
    setResults(null)

    // Simulate training process
    const trainingSteps = 100
    const targetAccuracy = models[selectedModel as keyof typeof models].accuracy_range[1]
    const baseDelay = advancedOptions ? 30 : 50 // Faster training with advanced options

    for (let i = 0; i <= trainingSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, baseDelay))
      setTrainingProgress(i)

      // More sophisticated accuracy progression
      if (i < 20) {
        // Initial rapid improvement
        setAccuracy(Math.min(targetAccuracy * 0.7, (i / 20) * targetAccuracy * 0.7))
      } else if (i < 60) {
        // Steady improvement
        const base = targetAccuracy * 0.7
        const increment = targetAccuracy * 0.2 * ((i - 20) / 40)
        setAccuracy(Math.min(targetAccuracy, base + increment + (Math.random() * 2 - 1)))
      } else {
        // Final refinement with small fluctuations
        const base = targetAccuracy * 0.9
        const increment = targetAccuracy * 0.1 * ((i - 60) / 40)
        setAccuracy(Math.min(targetAccuracy, base + increment + (Math.random() * 1 - 0.5)))
      }
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

    // More detailed results
    setResults({
      accuracy: targetAccuracy - 2 + Math.random() * 4,
      loss: 0.1 + Math.random() * 0.05,
      epochs: hyperparameters.epochs,
      training_time: advancedOptions ? "1.8 minutes" : "2.3 minutes",
      data: processedData,
      f1_score: 0.89 + Math.random() * 0.1,
      precision: 0.87 + Math.random() * 0.1,
      recall: 0.91 + Math.random() * 0.08,
      confusion_matrix: [
        [120, 8],
        [12, 180],
      ],
      learning_curve: Array.from({ length: 10 }, (_, i) => ({
        epoch: (i + 1) * 5,
        train_accuracy: 0.7 + i * 0.025 + Math.random() * 0.02,
        val_accuracy: 0.65 + i * 0.03 + Math.random() * 0.02,
      })),
    })

    setIsTraining(false)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Add user message
    const userMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (chatInput.toLowerCase().includes("help") || chatInput.toLowerCase().includes("how")) {
        response =
          "To train a model, select a dataset and model type from the Configuration panel, then click 'Start Training'. You can also try our pre-trained models or upload your own dataset."
      } else if (chatInput.toLowerCase().includes("dataset")) {
        response =
          "We offer several datasets including Sales Forecasting, Customer Behavior, Risk Assessment, Text Classification, and Image Recognition. You can also upload your own dataset in CSV format."
      } else if (chatInput.toLowerCase().includes("model")) {
        response =
          "We support Classification, Regression, Clustering, Transformer, and CNN models. Each is optimized for different types of data and prediction tasks."
      } else if (chatInput.toLowerCase().includes("accuracy")) {
        response =
          "Model accuracy depends on the dataset quality, model architecture, and hyperparameters. Our advanced options allow you to fine-tune these parameters for optimal results."
      } else {
        response =
          "I'm here to help with your AI training needs. You can ask about datasets, models, training parameters, or how to interpret results."
      }

      setChatMessages((prev) => [...prev, { role: "system", content: response }])
      setIsChatLoading(false)
    }, 1500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomDatasetFile(e.target.files[0])
    }
  }

  const uploadCustomDataset = () => {
    if (!customDatasetName || !customDatasetFile) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      // Add to datasets (in a real app, this would process the file)
      setIsUploading(false)

      // Show success message
      alert(`Dataset "${customDatasetName}" uploaded successfully!`)

      // Reset form
      setCustomDatasetName("")
      setCustomDatasetDescription("")
      setCustomDatasetFile(null)
    }, 2000)
  }

  const runInference = () => {
    if (!inferenceInput.trim()) return

    setIsInferenceRunning(true)

    // Simulate inference
    setTimeout(() => {
      let result

      if (selectedModel === "classification") {
        result = {
          prediction: Math.random() > 0.5 ? "Class A" : "Class B",
          confidence: 0.7 + Math.random() * 0.25,
          alternatives: [
            { class: "Class C", confidence: 0.1 + Math.random() * 0.2 },
            { class: "Class D", confidence: 0.05 + Math.random() * 0.15 },
          ],
        }
      } else if (selectedModel === "regression") {
        result = {
          prediction: 42.5 + Math.random() * 15,
          confidence_interval: [38 + Math.random() * 5, 48 + Math.random() * 5],
          r_squared: 0.85 + Math.random() * 0.1,
        }
      } else {
        result = {
          cluster: Math.floor(Math.random() * 3) + 1,
          distance_to_centroid: 0.2 + Math.random() * 0.3,
          nearest_neighbors: [5, 12, 18],
        }
      }

      setInferenceResult(result)
      setIsInferenceRunning(false)
    }, 1500)
  }

  const exportModel = () => {
    if (!results) return

    setIsModelExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsModelExporting(false)
      alert("Model exported successfully! (In a real application, this would download the model file)")
    }, 2000)
  }

  // Force show the page even if not logged in
  const handleForceShow = () => {
    setForceShow(true)
  }

  // Refresh the page to try again
  const handleRefresh = () => {
    window.location.reload()
  }

  // Show loading while auth is being checked
  if (authLoading && !forceShow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if needed
  if (!forceShow && !user && !initialUser && redirectAttempts <= 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground mb-8">Taking you to your destination...</p>

          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh Page
            </Button>

            <Button onClick={handleForceShow} className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Continue to AI Training Anyway
            </Button>

            <Link href="/auth?redirect=train-ai">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>

            <div className="mt-4 text-sm text-muted-foreground">
              If you keep seeing this message, click "Continue to AI Training Anyway"
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-primary/80 transition-colors">
                Home
              </Link>
              <Link href="/store" className="hover:text-primary/80 transition-colors">
                Store
              </Link>
              {!user && !initialUser && (
                <Link href="/auth?redirect=train-ai">
                  <Button size="sm" variant="outline">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              {(user || initialUser) && (
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.user_metadata?.full_name || user?.email || initialUser?.email || "Guest"}
                </span>
              )}
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Train Your AI Model</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of AI training with our interactive platform. Choose your dataset, select a model, and
            watch it learn in real-time with advanced visualization and analytics.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 mr-2" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Dataset</label>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(datasets).map(([key, dataset]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{dataset.name}</div>
                            <div className="text-xs text-muted-foreground">{dataset.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Model Type</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(models).map(([key, model]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expected Accuracy:</span>
                    <Badge variant="outline">
                      {models[selectedModel as keyof typeof models].accuracy_range[0]}-
                      {models[selectedModel as keyof typeof models].accuracy_range[1]}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Est. Training Time:</span>
                    <span className="text-sm">{advancedOptions ? "~3-5" : "~5-8"} seconds</span>
                  </div>
                </div>

                <Collapsible className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="advanced-options" checked={advancedOptions} onCheckedChange={setAdvancedOptions} />
                      <Label htmlFor="advanced-options">Advanced Options</Label>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Learning Rate: {hyperparameters.learningRate}</Label>
                      <Slider
                        value={[hyperparameters.learningRate * 1000]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          setHyperparameters({ ...hyperparameters, learningRate: value[0] / 1000 })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Batch Size: {hyperparameters.batchSize}</Label>
                      <Slider
                        value={[hyperparameters.batchSize]}
                        min={8}
                        max={128}
                        step={8}
                        onValueChange={(value) => setHyperparameters({ ...hyperparameters, batchSize: value[0] })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Epochs: {hyperparameters.epochs}</Label>
                      <Slider
                        value={[hyperparameters.epochs]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={(value) => setHyperparameters({ ...hyperparameters, epochs: value[0] })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Dropout Rate: {hyperparameters.dropout}</Label>
                      <Slider
                        value={[hyperparameters.dropout * 100]}
                        min={0}
                        max={50}
                        step={5}
                        onValueChange={(value) => setHyperparameters({ ...hyperparameters, dropout: value[0] / 100 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Optimizer</Label>
                      <Select
                        value={hyperparameters.optimizer}
                        onValueChange={(value) => setHyperparameters({ ...hyperparameters, optimizer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adam">Adam</SelectItem>
                          <SelectItem value="sgd">SGD</SelectItem>
                          <SelectItem value="rmsprop">RMSprop</SelectItem>
                          <SelectItem value="adagrad">Adagrad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Model Architecture</Label>
                      <Select value={modelArchitecture} onValueChange={setModelArchitecture}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {architectureOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              <div>
                                <div className="font-medium">{option.name}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="auto-ml" checked={useAutoML} onCheckedChange={setUseAutoML} />
                      <Label htmlFor="auto-ml">Use AutoML Optimization</Label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button onClick={startTraining} disabled={isTraining} className="w-full">
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

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get help with your AI training questions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-2">
                          <div
                            className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about models, datasets, etc."
                    disabled={isChatLoading}
                  />
                  <Button type="submit" size="icon" disabled={isChatLoading || !chatInput.trim()}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </form>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="training">
                  <Brain className="h-4 w-4 mr-2" />
                  Training
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="results">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="models">
                  <Layers className="h-4 w-4 mr-2" />
                  Models
                </TabsTrigger>
                <TabsTrigger value="inference">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Inference
                </TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-6 w-6 mr-2" />
                      Training Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Current Accuracy</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-2xl font-bold">{isTraining ? Math.floor(trainingProgress / 2) : 0}</div>
                        <div className="text-sm text-muted-foreground">Epochs Completed</div>
                      </div>
                    </div>

                    {isTraining && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2">
                          <Brain className="h-5 w-5 animate-pulse" />
                          <span>AI is learning from your data...</span>
                        </div>
                      </div>
                    )}

                    {/* Neural Network Visualization */}
                    {(isTraining || accuracy > 0) && (
                      <div className="pt-4">
                        <h4 className="text-sm font-medium mb-4">Neural Network Architecture</h4>
                        <div className="h-[200px] w-full bg-muted/30 rounded-lg relative overflow-hidden">
                          {/* Input Layer */}
                          <div className="absolute left-[10%] top-0 bottom-0 flex flex-col justify-center items-center">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full my-1 border-2 border-foreground/20 ${
                                  isTraining && i % 2 === 0 ? "animate-pulse bg-foreground/40" : "bg-foreground/20"
                                }`}
                                style={{
                                  transition: "all 0.5s ease",
                                }}
                              />
                            ))}
                            <div className="text-xs mt-2 text-muted-foreground">Input</div>
                          </div>

                          {/* Hidden Layers */}
                          {[0, 1].map((layer) => (
                            <div
                              key={layer}
                              className="absolute top-0 bottom-0 flex flex-col justify-center items-center"
                              style={{ left: `${30 + layer * 20}%` }}
                            >
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 rounded-full my-1 border-2 border-foreground/20 ${
                                    isTraining && (i + layer) % 2 === 1
                                      ? "animate-pulse bg-foreground/40"
                                      : "bg-foreground/20"
                                  }`}
                                  style={{
                                    transition: "all 0.5s ease",
                                  }}
                                />
                              ))}
                              <div className="text-xs mt-2 text-muted-foreground">Hidden {layer + 1}</div>
                            </div>
                          ))}

                          {/* Output Layer */}
                          <div className="absolute right-[10%] top-0 bottom-0 flex flex-col justify-center items-center">
                            {[0, 1].map((i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full my-1 border-2 border-foreground/20 ${
                                  isTraining ? "animate-pulse bg-foreground/40" : "bg-foreground/20"
                                }`}
                                style={{
                                  transition: "all 0.5s ease",
                                }}
                              />
                            ))}
                            <div className="text-xs mt-2 text-muted-foreground">Output</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Custom Dataset Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-6 w-6 mr-2" />
                      Custom Dataset
                    </CardTitle>
                    <CardDescription>Upload your own dataset for training</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="dataset-name">Dataset Name</Label>
                      <Input
                        id="dataset-name"
                        value={customDatasetName}
                        onChange={(e) => setCustomDatasetName(e.target.value)}
                        placeholder="E.g., Customer Transactions"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dataset-description">Description (Optional)</Label>
                      <Textarea
                        id="dataset-description"
                        value={customDatasetDescription}
                        onChange={(e) => setCustomDatasetDescription(e.target.value)}
                        placeholder="Brief description of your dataset"
                        rows={2}
                      />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="dataset-file">Upload File (CSV, JSON)</Label>
                      <Input id="dataset-file" type="file" accept=".csv,.json" onChange={handleFileUpload} />
                    </div>

                    <Button
                      onClick={uploadCustomDataset}
                      disabled={!customDatasetName || !customDatasetFile || isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Dataset
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-6 w-6 mr-2" />
                      Dataset: {datasets[selectedDataset as keyof typeof datasets].name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {datasets[selectedDataset as keyof typeof datasets].description}
                    </p>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        {selectedDataset === "sales" ? (
                          <LineChart data={datasets[selectedDataset].data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                color: "#111827",
                              }}
                            />
                            <Line type="monotone" dataKey="sales" stroke="#000000" strokeWidth={3} />
                          </LineChart>
                        ) : selectedDataset === "nlp" || selectedDataset === "image" ? (
                          <PieChart>
                            <Pie
                              data={datasets[selectedDataset as keyof typeof datasets].data}
                              dataKey="count"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {datasets[selectedDataset as keyof typeof datasets].data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={["#000000", "#374151", "#6b7280", "#9ca3af", "#d1d5db"][index % 5]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                color: "#111827",
                              }}
                            />
                          </PieChart>
                        ) : (
                          <BarChart data={datasets[selectedDataset as keyof typeof datasets].data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                              dataKey={Object.keys(datasets[selectedDataset as keyof typeof datasets].data[0])[0]}
                              stroke="#6b7280"
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                color: "#111827",
                              }}
                            />
                            <Bar
                              dataKey={Object.keys(datasets[selectedDataset as keyof typeof datasets].data[0])[1]}
                              fill="#000000"
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    {/* Data Statistics */}
                    <div className="mt-8">
                      <h4 className="text-sm font-medium mb-4">Dataset Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">
                            {datasets[selectedDataset as keyof typeof datasets].data.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Records</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">
                            {Object.keys(datasets[selectedDataset as keyof typeof datasets].data[0]).length}
                          </div>
                          <div className="text-sm text-muted-foreground">Features</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">
                            {selectedDataset === "sales"
                              ? "Time Series"
                              : selectedDataset === "customer"
                                ? "Categorical"
                                : selectedDataset === "financial"
                                  ? "Numerical"
                                  : selectedDataset === "nlp"
                                    ? "Text"
                                    : "Image"}
                          </div>
                          <div className="text-sm text-muted-foreground">Data Type</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">100%</div>
                          <div className="text-sm text-muted-foreground">Completeness</div>
                        </div>
                      </div>
                    </div>

                    {/* Correlation Matrix */}
                    <div className="mt-8">
                      <h4 className="text-sm font-medium mb-4">Feature Correlation Matrix</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <div className="grid grid-cols-4 gap-1 h-full">
                            {[
                              [1.0, 0.8, 0.3, 0.1],
                              [0.8, 1.0, 0.5, 0.2],
                              [0.3, 0.5, 1.0, 0.7],
                              [0.1, 0.2, 0.7, 1.0],
                            ].map((row, i) =>
                              row.map((value, j) => (
                                <div
                                  key={`${i}-${j}`}
                                  className="flex items-center justify-center text-xs font-medium rounded"
                                  style={{
                                    backgroundColor: `rgba(0, 0, 0, ${value * 0.8})`,
                                    color: value > 0.5 ? "#ffffff" : "#000000",
                                  }}
                                >
                                  {value.toFixed(1)}
                                </div>
                              )),
                            )}
                          </div>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Feature 1</span>
                        <span>Feature 2</span>
                        <span>Feature 3</span>
                        <span>Feature 4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                {results ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-6 w-6 mr-2" />
                        Training Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">{results.accuracy.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Final Accuracy</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">{results.loss.toFixed(3)}</div>
                          <div className="text-sm text-muted-foreground">Loss</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">{results.epochs}</div>
                          <div className="text-sm text-muted-foreground">Epochs</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold">{results.training_time}</div>
                          <div className="text-sm text-muted-foreground">Training Time</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Model Performance</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            {selectedDataset === "sales" ? (
                              <LineChart data={results.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    color: "#111827",
                                  }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#000000" strokeWidth={2} name="Actual" />
                                <Line
                                  type="monotone"
                                  dataKey="prediction"
                                  stroke="#6b7280"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  name="Predicted"
                                />
                              </LineChart>
                            ) : (
                              <BarChart data={results.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey={Object.keys(results.data[0])[0]} stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    color: "#111827",
                                  }}
                                />
                                <Bar dataKey={Object.keys(results.data[0])[1]} fill="#000000" />
                              </BarChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Advanced Metrics */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Advanced Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium mb-3">Performance Metrics</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">F1 Score</span>
                                <span className="text-sm font-medium">{results.f1_score.toFixed(3)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Precision</span>
                                <span className="text-sm font-medium">{results.precision.toFixed(3)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Recall</span>
                                <span className="text-sm font-medium">{results.recall.toFixed(3)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-3">Learning Curve</h5>
                            <div className="h-[150px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={results.learning_curve}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="epoch" stroke="#6b7280" />
                                  <YAxis stroke="#6b7280" domain={[0.6, 1]} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      color: "#111827",
                                    }}
                                  />
                                  <Line type="monotone" dataKey="train_accuracy" stroke="#000000" name="Train" />
                                  <Line type="monotone" dataKey="val_accuracy" stroke="#6b7280" name="Validation" />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confusion Matrix */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Confusion Matrix</h4>
                        <div className="max-w-md mx-auto">
                          <div className="grid grid-cols-3 gap-2">
                            <div></div>
                            <div className="text-center text-sm font-medium">Predicted</div>
                            <div></div>

                            <div className="text-sm font-medium flex items-center justify-center">Actual</div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="text-xs text-center p-1">Class A</div>
                              <div className="text-xs text-center p-1">Class B</div>
                            </div>
                            <div></div>

                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-center p-1">Class A</div>
                              <div className="text-xs text-center p-1">Class B</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {results.confusion_matrix.flat().map((value: number, index: number) => (
                                <div
                                  key={index}
                                  className="aspect-square flex items-center justify-center text-sm font-bold rounded"
                                  style={{
                                    backgroundColor: `rgba(0, 0, 0, ${(value / 200) * 0.8 + 0.1})`,
                                    color: value > 100 ? "#ffffff" : "#000000",
                                  }}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                            <div></div>
                          </div>

                          <div className="mt-4 text-xs text-muted-foreground text-center">
                            <div>
                              True Positives: {results.confusion_matrix[0][0]} | False Positives:{" "}
                              {results.confusion_matrix[0][1]}
                            </div>
                            <div>
                              False Negatives: {results.confusion_matrix[1][0]} | True Negatives:{" "}
                              {results.confusion_matrix[1][1]}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Deploy Model
                        </Button>
                        <Button variant="outline" onClick={exportModel} disabled={isModelExporting}>
                          {isModelExporting ? (
                            <>
                              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Export Model
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground">
                        Start training your AI model to see detailed results and performance metrics.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Pre-trained Models Tab */}
              <TabsContent value="models" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layers className="h-6 w-6 mr-2" />
                      Pre-trained Models
                    </CardTitle>
                    <CardDescription>Use our pre-trained models for quick deployment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Pre-trained Model</Label>
                        <Select value={selectedPretrainedModel} onValueChange={setSelectedPretrainedModel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pretrainedModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">{model.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selected Model Details */}
                      {selectedPretrainedModel && (
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium mb-2">
                            {pretrainedModels.find((m) => m.id === selectedPretrainedModel)?.name}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{pretrainedModels.find((m) => m.id === selectedPretrainedModel)?.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Parameters:</span>
                              <span>{pretrainedModels.find((m) => m.id === selectedPretrainedModel)?.parameters}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fine-tunable:</span>
                              <span>Yes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">License:</span>
                              <span>MIT</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Model Architecture Visualization */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-4">Model Architecture</h4>
                        <div className="h-[200px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                          {selectedPretrainedModel === "bert" && (
                            <div className="flex flex-col items-center">
                              <div className="text-xs mb-2">BERT Architecture</div>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs mb-1">
                                      Layer {i}
                                    </div>
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs">
                                      Attn
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 text-xs text-muted-foreground">
                                12 encoder layers with self-attention
                              </div>
                            </div>
                          )}

                          {selectedPretrainedModel === "gpt2" && (
                            <div className="flex flex-col items-center">
                              <div className="text-xs mb-2">GPT-2 Architecture</div>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs mb-1">
                                      Layer {i}
                                    </div>
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs">
                                      Attn
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 text-xs text-muted-foreground">
                                Decoder-only transformer architecture
                              </div>
                            </div>
                          )}

                          {selectedPretrainedModel === "resnet" && (
                            <div className="flex flex-col items-center">
                              <div className="text-xs mb-2">ResNet-50 Architecture</div>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs mb-1">
                                      Block {i}
                                    </div>
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs">
                                      Skip
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 text-xs text-muted-foreground">
                                50 layers with residual connections
                              </div>
                            </div>
                          )}

                          {selectedPretrainedModel === "vit" && (
                            <div className="flex flex-col items-center">
                              <div className="text-xs mb-2">Vision Transformer</div>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs mb-1">
                                      Patch {i}
                                    </div>
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs">
                                      Attn
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 text-xs text-muted-foreground">
                                Image patches with transformer layers
                              </div>
                            </div>
                          )}

                          {selectedPretrainedModel === "roberta" && (
                            <div className="flex flex-col items-center">
                              <div className="text-xs mb-2">RoBERTa Architecture</div>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs mb-1">
                                      Layer {i}
                                    </div>
                                    <div className="w-12 h-8 border border-foreground/20 rounded flex items-center justify-center text-xs">
                                      Attn
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 text-xs text-muted-foreground">
                                Optimized BERT with dynamic masking
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Load Model
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Fine-tune
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inference Tab */}
              <TabsContent value="inference" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-6 w-6 mr-2" />
                      Real-time Inference
                    </CardTitle>
                    <CardDescription>Test your trained model with new data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="inference-input">Input Data</Label>
                        <Textarea
                          id="inference-input"
                          value={inferenceInput}
                          onChange={(e) => setInferenceInput(e.target.value)}
                          placeholder={
                            selectedModel === "classification"
                              ? "Enter text to classify..."
                              : selectedModel === "regression"
                                ? "Enter numerical values (comma-separated)..."
                                : "Enter data points for clustering..."
                          }
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={runInference}
                        disabled={!inferenceInput.trim() || isInferenceRunning || !results}
                        className="w-full"
                      >
                        {isInferenceRunning ? (
                          <>
                            <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                            Running Inference...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Run Inference
                          </>
                        )}
                      </Button>

                      {!results && (
                        <div className="text-center text-muted-foreground text-sm">
                          Train a model first to enable inference
                        </div>
                      )}
                    </div>

                    {/* Inference Results */}
                    {inferenceResult && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Inference Results</h4>

                        {selectedModel === "classification" && (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Prediction:</span>
                                <Badge>{inferenceResult.prediction}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Confidence:</span>
                                <span className="text-sm font-medium">
                                  {(inferenceResult.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-2">Alternative Predictions</h5>
                              <div className="space-y-2">
                                {inferenceResult.alternatives.map((alt: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <span>{alt.class}</span>
                                    <span className="text-muted-foreground">{(alt.confidence * 100).toFixed(1)}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedModel === "regression" && (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Predicted Value:</span>
                                <span className="text-lg font-bold">{inferenceResult.prediction.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Confidence Interval:</span>
                                <span className="text-sm">
                                  [{inferenceResult.confidence_interval[0].toFixed(2)},{" "}
                                  {inferenceResult.confidence_interval[1].toFixed(2)}]
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">R²:</span>
                                <span className="text-sm font-medium">{inferenceResult.r_squared.toFixed(3)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedModel === "clustering" && (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Assigned Cluster:</span>
                                <Badge>Cluster {inferenceResult.cluster}</Badge>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Distance to Centroid:</span>
                                <span className="text-sm font-medium">
                                  {inferenceResult.distance_to_centroid.toFixed(3)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Nearest Neighbors:</span>
                                <span className="text-sm">{inferenceResult.nearest_neighbors.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Model Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2" />
                      Model Comparison
                    </CardTitle>
                    <CardDescription>Compare different model performances</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Performance Bar Chart */}
                    <div>
                      <h5 className="text-sm font-medium mb-4">Accuracy Comparison</h5>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { model: "Classification", accuracy: 92.5, training_time: 2.3 },
                              { model: "Regression", accuracy: 85.2, training_time: 1.8 },
                              { model: "Clustering", accuracy: 88.7, training_time: 2.1 },
                              { model: "Transformer", accuracy: 95.1, training_time: 4.2 },
                              { model: "CNN", accuracy: 91.3, training_time: 3.5 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="model" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                color: "#111827",
                              }}
                            />
                            <Bar dataKey="accuracy" fill="#000000" name="Accuracy %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Performance Matrix */}
                    <div>
                      <h5 className="text-sm font-medium mb-4">Model Performance Matrix</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Model</th>
                              <th className="text-center p-2">Accuracy</th>
                              <th className="text-center p-2">Precision</th>
                              <th className="text-center p-2">Recall</th>
                              <th className="text-center p-2">F1-Score</th>
                              <th className="text-center p-2">Training Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                model: "Classification",
                                accuracy: 92.5,
                                precision: 91.2,
                                recall: 93.8,
                                f1: 92.5,
                                time: "2.3m",
                              },
                              {
                                model: "Regression",
                                accuracy: 85.2,
                                precision: 84.1,
                                recall: 86.3,
                                f1: 85.2,
                                time: "1.8m",
                              },
                              {
                                model: "Clustering",
                                accuracy: 88.7,
                                precision: 87.9,
                                recall: 89.5,
                                f1: 88.7,
                                time: "2.1m",
                              },
                              {
                                model: "Transformer",
                                accuracy: 95.1,
                                precision: 94.8,
                                recall: 95.4,
                                f1: 95.1,
                                time: "4.2m",
                              },
                              { model: "CNN", accuracy: 91.3, precision: 90.7, recall: 91.9, f1: 91.3, time: "3.5m" },
                            ].map((row, index) => (
                              <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="p-2 font-medium">{row.model}</td>
                                <td className="p-2 text-center">
                                  <div
                                    className="inline-block px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `rgba(0, 0, 0, ${(row.accuracy / 100) * 0.8 + 0.1})`,
                                      color: row.accuracy > 90 ? "#ffffff" : "#000000",
                                    }}
                                  >
                                    {row.accuracy}%
                                  </div>
                                </td>
                                <td className="p-2 text-center">{row.precision}%</td>
                                <td className="p-2 text-center">{row.recall}%</td>
                                <td className="p-2 text-center">{row.f1}%</td>
                                <td className="p-2 text-center">{row.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cross-Validation Matrix */}
                    <div>
                      <h5 className="text-sm font-medium mb-4">Cross-Validation Results Matrix</h5>
                      <div className="grid grid-cols-6 gap-2 max-w-2xl">
                        <div className="text-xs font-medium p-2">Model</div>
                        <div className="text-xs font-medium p-2 text-center">Fold 1</div>
                        <div className="text-xs font-medium p-2 text-center">Fold 2</div>
                        <div className="text-xs font-medium p-2 text-center">Fold 3</div>
                        <div className="text-xs font-medium p-2 text-center">Fold 4</div>
                        <div className="text-xs font-medium p-2 text-center">Fold 5</div>

                        {[
                          { model: "Classification", folds: [92.1, 93.2, 91.8, 92.9, 92.5] },
                          { model: "Regression", folds: [84.8, 85.6, 84.9, 85.3, 85.2] },
                          { model: "Transformer", folds: [94.9, 95.3, 94.8, 95.2, 95.1] },
                        ].map((row, i) => (
                          <React.Fragment key={i}>
                            <div className="text-xs p-2 font-medium">{row.model}</div>
                            {row.folds.map((score, j) => (
                              <div
                                key={j}
                                className="text-xs p-2 text-center rounded font-medium"
                                style={{
                                  backgroundColor: `rgba(0, 0, 0, ${(score / 100) * 0.8 + 0.1})`,
                                  color: score > 90 ? "#ffffff" : "#000000",
                                }}
                              >
                                {score.toFixed(1)}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready for Professional AI Training?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This is just a taste of what's possible. Get professional AI training services tailored to your specific
                business needs with enterprise-grade infrastructure and support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store">
                  <Button>Browse AI Services</Button>
                </Link>
                <Button variant="outline">Schedule Consultation</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
