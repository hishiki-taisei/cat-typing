'use client'

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from 'framer-motion'
import * as wanakana from 'wanakana'

const INITIAL_TIME = 30
const INITIAL_CAT_SIZE = 200
const MIN_CAT_SIZE = 20
const TIME_BONUS = 1
const CELEBRATION_DURATION = 2000
const NUM_CELEBRATION_CATS = 50

const difficulties = {
  1: { name: '豆知識', words: [
    "ひげは、暗闇でも周囲の状況を感知するセンサーの役割を果たしています。",
    "目は、人間の６倍もの光を感知できます。暗闇でもよく見えるのはこのためです。",
    "高い所が好き。これは、外敵から身を守るため、高い場所から獲物を探すためと考えられています。",
    "肉球に汗腺があり、体温調節をしています。",
    "ゴロゴロという音は、喉の周りの筋肉の収縮によって発生すると言われています。",
    "平均睡眠時間は１２から１６時間。人生の約３分の２を寝て過ごします。",
    "きれい好き。１日の大半を毛づくろいに費やすこともあります。",
    "縄張り意識が強く、自分のテリトリーをマーキングします。",
    "優れたハンター。聴覚は人間の３倍、嗅覚は１４倍優れています。",
    "舌には、細かい棘のような突起があります。これは、毛づくろいや獲物の骨から肉を削ぎ落とすのに役立ちます。",
    "肉食動物。体内でタウリンを合成できないため、食事から摂取する必要があります。",
    "祖先はリビアヤマネコと言われています。",
    "世界には様々な猫種が存在しますが、その数は約４０種類と言われています。",
    "聴力は、犬よりも高周波の音を聞き取ることができます。",
    "一度聞いた音を記憶することができます。",
    "優れたバランス感覚を持っています。これは、内耳の構造によるものです。",
    "水をあまり好きではありませんが、泳ぐのが得意な猫もいます。",
    "人間よりも多くの骨を持っています。人間は約２０６個ですが、猫は約２３０個あります。",
    "肉球の色は、毛の色と関係があることが多いです。",
    "尻尾は、感情表現やバランスを取るのに役立ちます。",
    "人間の２００倍もの嗅覚受容体細胞を持っています。",
    "耳は、１８０度回転させることができます。",
    "３２本の歯を持っています。",
    "高い音だけでなく、超音波も聞くことができます。",
    "寝姿は、気温や気分によって変化します。",
    "自分の名前を理解することができます。",
    "爪を引っ込めることができますが、チーターは引っ込めることができません。",
    "平均寿命は、１５年前後です。",
    "猫アレルギーの原因は、猫の毛ではなく、唾液や皮脂腺からの分泌物です。",
    "三毛猫のほとんどはメスです。オスの三毛猫は非常に珍しく、幸運を呼ぶと言われています。",
    "甘味を感じることができません。",
    "ウィスカーパッド（ひげの付け根の膨らみ）を使って、狭い場所を通れるかどうかを判断します。",
    "高いところから落ちても、うまく体勢を立て直して着地することができます。",
    "狩りが得意で、ネズミなどの小動物を捕まえます。",
    "おもちゃで遊ぶことが大好きです。",
    "人間とコミュニケーションをとることができます。",
    "ストレスを感じると、過剰に毛づくろいをすることがあります。",
    "嘔吐することで、毛玉を吐き出します。",
    "それぞれ異なる性格を持っています。",
    "猫を飼うことで、癒やし効果が得られると言われています。"
  ] },
  2: { name: '歴史', words: [
    "猫の家畜化は、約1万年前に中東で始まったと考えられています。",
    "古代エジプトでは、猫は神聖な動物として崇拝され、バステト女神として祀られていました。",
    "中世ヨーロッパでは、魔女狩りの際に猫も悪魔の使いとして迫害されました。",
    "大航海時代には、猫は船のネズミ駆除役として世界中に広まりました。",
    "19世紀には、純血種の猫が誕生し、猫の品種改良が盛んになりました。",
    "日本では、平安時代にはすでに猫が飼われていた記録が残っています。",
    "招き猫は、江戸時代に日本で生まれた幸運のシンボルです。",
    "現代では、猫は世界中で愛されるペットとして、多くの家庭で暮らしています。"  ] }
}

const catComments = {
  low: {
    face: '😺',
    comments: [
      "にゃ…にゃんだか、手が滑っちゃったみたい… (///)",
      "もう一回…？　ちょっと休憩してからにするにゃ…",
      "これは…練習が必要みたいにゃあ…",
      "ｚｚｚ… (キーボードの上で寝始める)",
      "ボクはまだ本気出してないにゃ！",
      "キーボードが、お魚型に見えてきたにゃ…",
      "お腹すいたにゃ〜。タイピングよりご飯にゃ！",
      "ちょっと、このキーボード、肉球に優しくないにゃ…",
      "画面の向こうのネズミを追いかけてたら、ミスっちゃったにゃ！",
      "もう一回やったら、きっと爪が研げるくらい速くなるにゃ！"
    ]
  },
  medium: {
    face: '😺',
    comments: [
      "まずまずの出来にゃ！でも、もっと上を目指せるはずにゃ！",
      "次はもっと頑張るにゃ！見ててにゃ！",
      "もうちょっとで完璧だったのに…惜しいにゃ！",
      "にゃるほど、なかなかやるにゃん！",
      "まだまだ伸びしろがあるにゃ！"
    ]
  },
  high: {
    face: '😼',
    comments: [
      "素晴らしいにゃ！さすがは君にゃ！",
      "にゃんと見事なタイピング！ボクもびっくりにゃ！",
      "完璧にゃ！もう爪を研ぐ必要もないにゃ！",
      "まさに神業にゃ！尊敬するにゃ！",
      "最強のタイピストにゃ！参ったにゃ！"
    ]
  },
  perfect: {
    face: '😻',
    comments: [
      "伝説に残るタイピングにゃ！歴史に名を刻むにゃ！",
      "にゃんと！パーフェクトスコア！信じられないにゃ！",
      "君はもうタイピングマスターにゃ！師匠と呼ばせてにゃ！",
      "これはもう奇跡にゃ！ボク、感動したにゃ！",
      "世界一のタイピストは君にゃ！おめでとうにゃ！"
    ]
  }
}

const TitleScreenCat = () => (
  <div className="text-9xl mb-8 animate-bounce">😺</div>
)

const CelebrationCats = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: NUM_CELEBRATION_CATS }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute text-6xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: -window.innerHeight,
                opacity: 1,
                transition: {
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 0.5,
                },
              }}
              exit={{ opacity: 0 }}
            >
              😺
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ImprovedCatTypingGame() {
  const [currentText, setCurrentText] = useState({ japanese: '', romaji: '' })
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [isPlaying, setIsPlaying] = useState(false)
  const [catSize, setCatSize] = useState(INITIAL_CAT_SIZE)
  const [difficulty, setDifficulty] = useState(1)
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [gameOverStats, setGameOverStats] = useState({ score: 0, speed: 0, mistakes: 0 })
  const [showGameOver, setShowGameOver] = useState(false)
  const [catMood, setCatMood] = useState('normal')
  const [catComment, setCatComment] = useState({ face: '', comment: '' })
  const [catProgress, setCatProgress] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const generateText = useCallback(() => {
    if (difficulty in difficulties) {
      const words = difficulties[difficulty as keyof typeof difficulties].words
      const japanese = words[Math.floor(Math.random() * words.length)]
      const romaji = wanakana.toRomaji(japanese)
      return { japanese, romaji }
    }
    return { japanese: '', romaji: '' }
  }, [difficulty])

  const startGame = () => {
    setScore(0)
    setTimeLeft(INITIAL_TIME)
    setIsPlaying(true)
    setCatSize(INITIAL_CAT_SIZE)
    setCurrentText(generateText())
    setInput('')
    setTotalKeystrokes(0)
    setMistakes(0)
    setShowGameOver(false)
    setCatMood('normal')
    setCatComment({ face: '', comment: '' })
    setCatProgress(0)
  }

  const checkInput = () => {
    const normalizedInput = wanakana.toRomaji(input.toLowerCase())
    const normalizedCurrentText = currentText.romaji.toLowerCase()

    if (normalizedInput === normalizedCurrentText) {
      setScore(prevScore => prevScore + 1)
      setTimeLeft(prevTime => Math.min(prevTime + TIME_BONUS, INITIAL_TIME))
      setCurrentText(generateText())
      setInput('')
      setCatMood('happy')
      setCatProgress(0)
      setShowCelebration(true)
      setTimeout(() => {
        setShowCelebration(false)
        setCatMood('normal')
      }, CELEBRATION_DURATION)
    } else {
      setMistakes(prev => prev + 1)
    }
    
    const accuracy = normalizedInput.split('').filter((char, index) => char === normalizedCurrentText[index]).length / normalizedCurrentText.length
    setCatProgress(accuracy)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setTotalKeystrokes(prev => prev + 1)
    checkInput()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      checkInput()
    }
  }

  const generateCatComment = (score: number) => {
    let category
    if (score <= 2) category = catComments.low
    else if (score <= 5) category = catComments.medium
    else if (score <= 9) category = catComments.high
    else category = catComments.perfect

    const randomIndex = Math.floor(Math.random() * category.comments.length)
    return {
      face: category.face,
      comment: category.comments[randomIndex]
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0.1) {
            clearInterval(timer)
            setIsPlaying(false)
            const speed = Math.round(totalKeystrokes / INITIAL_TIME * 10) / 10
            setGameOverStats({ score, speed, mistakes })
            setShowGameOver(true)
            setCatComment(generateCatComment(score))
            return 0
          }
          return prevTime - 0.1
        })
        setCatSize(prevSize => Math.max(MIN_CAT_SIZE + (INITIAL_CAT_SIZE - MIN_CAT_SIZE) * timeLeft / INITIAL_TIME, MIN_CAT_SIZE))
      }, 100)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, score, totalKeystrokes, mistakes])

  const renderColoredText = (text: string, input: string) => {
    const normalizedInput = wanakana.toHiragana(input.toLowerCase())
    const normalizedText = wanakana.toHiragana(text.toLowerCase())
    return text.split('').map((char, index) => (
      <span key={index} className={normalizedInput[index] === normalizedText[index] ? 'text-pink-500' : 'text-gray-400'}>
        {char}
      </span>
    ))
  }

  const getCatFace = () => {
    switch (catMood) {
      case 'happy': return '😺'
      default: return '😺'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4 font-mochiy-pop">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');
        body {
          font-family: 'Mochiy Pop One', sans-serif;
        }
      `}</style>
      <h1 className="text-4xl font-bold mb-4 text-pink-600">猫タイピングゲーム</h1>
      {!isPlaying && !showGameOver && (
        <>
          <TitleScreenCat />
          <div className="flex flex-col gap-4 mb-4">
            {Object.entries(difficulties).map(([level, { name }]) => (
              <Button
                key={level}
                onClick={() => {
                  setDifficulty(Number(level))
                  startGame()
                }}
                className="w-64 bg-pink-400 hover:bg-pink-500 text-white"
              >
                {name}
              </Button>
            ))}
          </div>
        </>
      )}
      {isPlaying && (
        <>
          <div className="text-2xl font-bold mb-2 text-pink-700">{currentText.japanese}</div>
          <div className="text-xl mb-4">{renderColoredText(currentText.romaji, input)}</div>
          <Input
            type="text"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="mb-4 text-center text-2xl border-pink-300 focus:border-pink-500 focus:ring-pink-500"
            autoFocus
          />
          <div className="relative w-full h-32 bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="absolute left-0 bottom-0 w-full h-1 bg-pink-100">
              <div
                className="h-full bg-pink-400 transition-all duration-300 ease-out"
                style={{ width: `${catProgress * 100}%` }}
              ></div>
            </div>
            <div
              className="absolute bottom-0 transition-all duration-300 ease-out"
              style={{ left: `${catProgress * 100}%`, transform: 'translateX(-50%)' }}
            >
              <span style={{ fontSize: `${catSize}px`, lineHeight: 1 }}>{getCatFace()}</span>
            </div>
            <div className="absolute right-4 bottom-4">
              <span style={{ fontSize: '48px' }}>🍣</span>
            </div>
          </div>
          <div className="mt-4 text-xl text-pink-600">
            スコア: {score} | 残り時間: {Math.ceil(timeLeft)}秒
          </div>
        </>
      )}
      {showGameOver && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">ゲームオーバー</h2>
          <div className="mb-2 text-pink-700">最終スコア: {gameOverStats.score}</div>
          <div className="mb-2 text-pink-700">タイピング速度: {gameOverStats.speed} キー/秒</div>
          <div className="mb-4 text-pink-700">ミスの数: {gameOverStats.mistakes}</div>
          <div className="mb-4 text-center">
            <span className="text-4xl">{catComment.face}</span>
            <p className="mt-2 text-pink-600">{catComment.comment}</p>
          </div>
          <Button onClick={() => {
            setDifficulty(1)
            setTimeLeft(INITIAL_TIME)
            setShowGameOver(false)
          }} className="w-full bg-pink-400 hover:bg-pink-500 text-white">
            タイトルに戻る
          </Button>
        </div>
      )}
      <CelebrationCats isVisible={showCelebration} />
    </div>
  )
}