import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  BrowserMultiFormatReader,
} from '@zxing/browser'

import JsBarcode from 'jsbarcode'

import './App.css'


// ==========================================
// PRODUCT CATEGORIES
// ==========================================

const categories = {
  Frozen: [
    'ice cream',
    'frozen french fries',
    'frozen nuggets',
    'frozen peas',
    'frozen corn',
    'frozen samosa',
    'frozen paratha',
  ],

  'Chilled / Dairy': [
    'milk',
    'curd / dahi',
    'butter',
    'paneer',
    'cheese',
    'chocolate',
    'cold drink / soft drink',
    'juice',
  ],

  'Fresh / Vegetables': [
    'potato',
    'onion',
    'tomato',
    'lemon',
    'coriander / dhaniya',
    'green chilli',
    'ginger',
    'garlic',
  ],

  Grocery: [
    'maggi / instant noodles',
    'biscuits',
    'bread',
    'cooking oil',
    'wheat flour / atta',
    'rice',
    'sugar',
    'salt',
    'tea',
    'coffee',
    'chips',
    'namkeen',
  ],

  General: [
    'lipstick',
    'water bottle',
    'tiffin box',
    'mobile stand',
    'eveready ultima',
    'football',
    'soft toy',
  ],
}


// ==========================================
// FRONTEND PRODUCT INFO
// ==========================================

const productInfo = {
  'ice cream': {
    size: '500 ml',
    photo: '/products/ice-cream.jpg',
  },

  'frozen french fries': {
    size: '500 g',
    photo: '',
  },

  'frozen nuggets': {
    size: '500 g',
    photo: '',
  },

  'frozen peas': {
    size: '500 g',
    photo: '',
  },

  'frozen corn': {
    size: '500 g',
    photo: '',
  },

  'frozen samosa': {
    size: '500 g',
    photo: '',
  },

  'frozen paratha': {
    size: '400 g',
    photo: '',
  },

  milk: {
    size: '1 L',
    photo: '/products/milk.jpg',
  },

  'curd / dahi': {
    size: '500 g',
    photo: '',
  },

  butter: {
    size: '500 g',
    photo: '',
  },

  paneer: {
    size: '200 g',
    photo: '',
  },

  cheese: {
    size: '200 g',
    photo: '',
  },

  chocolate: {
    size: '100 g',
    photo: '',
  },

  'cold drink / soft drink': {
    size: '750 ml',
    photo: '',
  },

  juice: {
    size: '1 L',
    photo: '',
  },

  potato: {
    size: '1 kg',
    photo: '',
  },

  onion: {
    size: '1 kg',
    photo: '',
  },

  tomato: {
    size: '1 kg',
    photo: '',
  },

  lemon: {
    size: '500 g',
    photo: '',
  },

  'coriander / dhaniya': {
    size: '100 g',
    photo: '',
  },

  'green chilli': {
    size: '250 g',
    photo: '',
  },

  ginger: {
    size: '250 g',
    photo: '',
  },

  garlic: {
    size: '250 g',
    photo: '',
  },

  'maggi / instant noodles': {
    size: '280 g',
    photo: '',
  },

  biscuits: {
    size: '200 g',
    photo: '',
  },

  bread: {
    size: '400 g',
    photo: '',
  },

  'cooking oil': {
    size: '1 L',
    photo: '',
  },

  'wheat flour / atta': {
    size: '5 kg',
    photo: '',
  },

  rice: {
    size: '5 kg',
    photo: '',
  },

  sugar: {
    size: '1 kg',
    photo: '',
  },

  salt: {
    size: '1 kg',
    photo: '',
  },

  tea: {
    size: '250 g',
    photo: '',
  },

  coffee: {
    size: '200 g',
    photo: '',
  },

  chips: {
    size: '100 g',
    photo: '',
  },

  namkeen: {
    size: '200 g',
    photo: '',
  },

  lipstick: {
    size: '1 pc',
    photo: '',
  },

  'water bottle': {
    size: '1 L',
    photo: '',
  },

  'tiffin box': {
    size: '1 pc',
    photo: '',
  },

  'mobile stand': {
    size: '1 pc',
    photo: '',
  },

  'eveready ultima': {
    size: '1 pc',
    photo: '',
  },

  football: {
    size: '1 pc',
    photo: '',
  },

  'soft toy': {
    size: '1 pc',
    photo: '',
  },
}


// ==========================================
// DEMO DELIVERY PARTNERS
// ==========================================

const deliveryPartners = [
  'Ramesh Patil',
  'Afan Shaikh',
  'Omkar Jadhav',
  'Amit Sharma',
  'Rahul More',
  'Sahil Khan',
]


// ==========================================
// HELPERS
// ==========================================

const getProductInfo = (
  productName
) => {
  const key =
    String(productName || '')
      .trim()
      .toLowerCase()

  return (
    productInfo[key] || {
      size: '',
      photo: '',
    }
  )
}


const formatTime = (
  seconds
) => {
  const safeSeconds =
    Math.max(
      0,
      Number(seconds) || 0
    )

  const minutes =
    Math.floor(
      safeSeconds / 60
    )

  const remainingSeconds =
    safeSeconds % 60

  return `${String(minutes).padStart(
    2,
    '0'
  )}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}


// ==========================================
// APP
// ==========================================

function App() {

  // ========================================
  // ORDER CREATION
  // ========================================

  const [category, setCategory] =
    useState('')

  const [product, setProduct] =
    useState('')

  const [quantity, setQuantity] =
    useState(1)

  const [order, setOrder] =
    useState([])


  // ========================================
  // PICKING
  // ========================================

  const [mode, setMode] =
    useState('default')

  const [pickerItems, setPickerItems] =
    useState([])

  const [pickedSkus, setPickedSkus] =
    useState([])

  const [scannedCounts, setScannedCounts] =
    useState({})

  const scannedCountsRef =
    useRef({})


  // ========================================
  // SCANNER
  // ========================================

  const [manualBarcode, setManualBarcode] =
    useState('')

  const [scannerMessage, setScannerMessage] =
    useState('')

  const [scannerError, setScannerError] =
    useState('')

  const [wrongScanMessage, setWrongScanMessage] =
    useState('')

  const [cameraOpen, setCameraOpen] =
    useState(false)

  const [torchOn, setTorchOn] =
    useState(false)

  const [cameraError, setCameraError] =
    useState('')

  const [showDemoBarcode, setShowDemoBarcode] =
    useState(false)


  // ========================================
  // GENERAL STATUS
  // ========================================

  const [distance, setDistance] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [directionLoading, setDirectionLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  /*
    CREATING
      Editable order

    PICKING
      Order locked + timer running

    COMPLETED
      Picker work finished
  */

  const [orderStatus, setOrderStatus] =
    useState('CREATING')


  // ========================================
  // DELIVERY PARTNER
  // ========================================

  const [deliveryPartner, setDeliveryPartner] =
    useState('')


  // ========================================
  // TIMER
  // ========================================

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0)

  const [finalCompletionTime, setFinalCompletionTime] =
    useState(null)

  const timerStartRef =
    useRef(null)

  const timerIntervalRef =
    useRef(null)


  // ========================================
  // CAMERA REFS
  // ========================================

  const videoRef =
    useRef(null)

  const controlsRef =
    useRef(null)

  const barcodeRef =
    useRef(null)

  // ========================================
  // AUDIO / SCANNER REFS
  // ========================================

  const audioContextRef =
    useRef(null)

  const backgroundSoundRef =
    useRef(null)

  const warningMinutesPlayedRef =
    useRef(new Set())

  const lastCameraBarcodeRef =
    useRef({
      value: '',
      time: 0,
    })

  const cameraStartRef =
    useRef(false)

  const cameraScanLockedRef =
    useRef(false)

  const cameraLastDetectionAtRef =
    useRef(0)

  const nativeBarcodeDetectorRef =
    useRef(null)

  const nativeScanFrameRef =
    useRef(null)

  const cameraStreamRef =
    useRef(null)

  const torchOnRef =
    useRef(false)


  // ========================================
  // AUDIO HELPERS
  // ========================================

  const getAudioContext = () => {
    if (typeof window === 'undefined') {
      return null
    }

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext

      if (!AudioContextClass) {
        return null
      }

      audioContextRef.current =
        new AudioContextClass()
    }

    const context =
      audioContextRef.current

    if (context.state === 'suspended') {
      context.resume().catch(() => { })
    }

    return context
  }


  const playTone = (
    frequency,
    duration = 0.12,
    type = 'sine',
    volume = 0.06
  ) => {
    const context =
      getAudioContext()

    if (!context) {
      return
    }

    const oscillator =
      context.createOscillator()

    const gain =
      context.createGain()

    oscillator.type = type

    oscillator.frequency.setValueAtTime(
      frequency,
      context.currentTime
    )

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime
    )

    gain.gain.exponentialRampToValueAtTime(
      Math.max(volume, 0.001),
      context.currentTime + 0.01
    )

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration
    )

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start()
    oscillator.stop(
      context.currentTime + duration + 0.03
    )
  }


  const playClickSound = () => {
    playTone(
      720,
      0.055,
      'square',
      0.025
    )
  }


  const playCorrectSound = () => {
    playTone(
      880,
      0.09,
      'sine',
      0.07
    )

    window.setTimeout(() => {
      playTone(
        1175,
        0.12,
        'sine',
        0.055
      )
    }, 70)
  }


  const playWrongSound = () => {
    // Short three-pulse warning buzzer.
    // Deliberately different from the 5-minute siren.
    playTone(
      145,
      0.09,
      'square',
      0.085
    )

    window.setTimeout(() => {
      playTone(
        110,
        0.09,
        'square',
        0.075
      )
    }, 115)

    window.setTimeout(() => {
      playTone(
        85,
        0.11,
        'square',
        0.065
      )
    }, 235)
  }


  const playCompleteSound = () => {
    const notes = [
      523,
      659,
      784,
      1047,
    ]

    notes.forEach(
      (frequency, index) => {
        window.setTimeout(() => {
          playTone(
            frequency,
            0.2,
            'sine',
            0.06
          )
        }, index * 110)
      }
    )
  }


  const playOrderConfirmedSound = () => {
    playTone(
      392,
      0.11,
      'sine',
      0.055
    )

    window.setTimeout(() => {
      playTone(
        523,
        0.12,
        'sine',
        0.06
      )
    }, 90)

    window.setTimeout(() => {
      playTone(
        659,
        0.15,
        'sine',
        0.065
      )
    }, 180)
  }


  const playWarningSiren = () => {
    const context =
      getAudioContext()

    if (!context) {
      return
    }

    const oscillator =
      context.createOscillator()

    const gain =
      context.createGain()

    oscillator.type =
      'sawtooth'

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime
    )

    gain.gain.exponentialRampToValueAtTime(
      0.08,
      context.currentTime + 0.05
    )

    oscillator.connect(gain)
    gain.connect(context.destination)

    const startTime =
      context.currentTime

    const endTime =
      startTime + 5

    for (
      let index = 0;
      index < 10;
      index += 1
    ) {
      const time =
        startTime + index * 0.5

      oscillator.frequency.setValueAtTime(
        520,
        time
      )

      oscillator.frequency.linearRampToValueAtTime(
        920,
        time + 0.25
      )
    }

    gain.gain.setValueAtTime(
      0.07,
      endTime - 0.25
    )

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      endTime
    )

    oscillator.start(startTime)
    oscillator.stop(endTime + 0.05)
  }


  const startBackgroundSound = () => {
    const context =
      getAudioContext()

    if (
      !context ||
      backgroundSoundRef.current
    ) {
      return
    }

    const masterGain =
      context.createGain()

    masterGain.gain.value =
      0.014

    masterGain.connect(
      context.destination
    )

    const oscillator1 =
      context.createOscillator()

    const oscillator2 =
      context.createOscillator()

    oscillator1.type = 'sine'
    oscillator2.type = 'triangle'

    oscillator1.frequency.value = 196
    oscillator2.frequency.value = 293.66

    oscillator1.connect(masterGain)
    oscillator2.connect(masterGain)

    oscillator1.start()
    oscillator2.start()

    backgroundSoundRef.current = {
      masterGain,
      oscillator1,
      oscillator2,
    }
  }


  const stopBackgroundSound = () => {
    const background =
      backgroundSoundRef.current

    if (!background) {
      return
    }

    try {
      const context =
        background.masterGain.context

      background.masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.15
      )

      background.oscillator1.stop(
        context.currentTime + 0.18
      )

      background.oscillator2.stop(
        context.currentTime + 0.18
      )
    } catch {
      // Already stopped.
    }

    backgroundSoundRef.current =
      null
  }


  // ========================================
  // CATEGORY
  // ========================================

  const handleCategoryChange = (
    value
  ) => {

    if (
      orderStatus !==
      'CREATING'
    ) {
      return
    }

    playClickSound()

    setCategory(value)
    setProduct('')
    setQuantity(1)
    setError('')
  }


  // ========================================
  // ADD PRODUCT
  // ========================================

  const addProduct = () => {

    if (
      orderStatus !==
      'CREATING'
    ) {
      return
    }

    playClickSound()

    if (
      !category ||
      !product
    ) {

      setError(
        'Please select a category and product.'
      )

      return
    }

    const existingIndex =
      order.findIndex(
        (item) =>
          item.product_name ===
          product
      )

    if (
      existingIndex !==
      -1
    ) {

      const updatedOrder =
        [...order]

      updatedOrder[
        existingIndex
      ] = {

        ...updatedOrder[
        existingIndex
        ],

        quantity:
          updatedOrder[
            existingIndex
          ].quantity +
          quantity,
      }

      setOrder(
        updatedOrder
      )

    } else {

      setOrder([
        ...order,

        {
          product_name:
            product,

          quantity:
            quantity,
        },
      ])
    }

    setProduct('')
    setQuantity(1)
    setError('')
  }


  // ========================================
  // QUANTITY
  // ========================================

  const increaseQuantity = (
    index
  ) => {

    if (
      orderStatus !==
      'CREATING'
    ) {
      return
    }

    playClickSound()

    const updatedOrder =
      [...order]

    updatedOrder[
      index
    ].quantity += 1

    setOrder(
      updatedOrder
    )
  }


  const decreaseQuantity = (
    index
  ) => {

    if (
      orderStatus !==
      'CREATING'
    ) {
      return
    }

    playClickSound()

    const updatedOrder =
      [...order]

    if (
      updatedOrder[
        index
      ].quantity > 1
    ) {

      updatedOrder[
        index
      ].quantity -= 1
    }

    setOrder(
      updatedOrder
    )
  }


  const removeProduct = (
    index
  ) => {

    if (
      orderStatus !==
      'CREATING'
    ) {
      return
    }

    playClickSound()

    setOrder(
      order.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    )
  }


  // ========================================
  // BACKEND ROUTE
  // ========================================

  const fetchPickingRoute =
    async (
      selectedMode,
      resetPicking = false
    ) => {

      const response =
        await fetch(
          'http://localhost:8000/pick-order',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                items:
                  order,

                reverse:
                  selectedMode ===
                  'reverse',
              }),
          }
        )

      let data

      try {

        data =
          await response.json()

      } catch {

        throw new Error(
          'Invalid response from backend.'
        )
      }

      if (
        !response.ok
      ) {

        throw new Error(
          data.error ||
          'Backend request failed.'
        )
      }

      setPickerItems(
        Array.isArray(
          data.picker_items
        )
          ? data.picker_items
          : []
      )

      setDistance(
        data.total_walking_distance_m ??
        null
      )

      if (
        resetPicking
      ) {

        setPickedSkus(
          []
        )

        scannedCountsRef.current = {}

        setScannedCounts(
          {}
        )

        setManualBarcode(
          ''
        )

        setScannerMessage(
          ''
        )

        setScannerError(
          ''
        )

        setWrongScanMessage(
          ''
        )

        setShowDemoBarcode(
          false
        )

        setDeliveryPartner(
          ''
        )
      }
    }


  // ========================================
  // TIMER START
  // ========================================

  const startPickingTimer =
    () => {

      if (
        timerIntervalRef.current
      ) {

        clearInterval(
          timerIntervalRef.current
        )

        timerIntervalRef.current =
          null
      }

      timerStartRef.current =
        Date.now()

      setElapsedSeconds(
        0
      )

      setFinalCompletionTime(
        null
      )

      warningMinutesPlayedRef.current =
        new Set()

      timerIntervalRef.current =
        setInterval(() => {

          if (
            !timerStartRef.current
          ) {
            return
          }

          const seconds =
            Math.floor(
              (
                Date.now() -
                timerStartRef.current
              ) / 1000
            )

          setElapsedSeconds(
            seconds
          )

          const warningMilestones = [
            300,
            420,
            600,
          ]

          const nextWarning =
            warningMilestones.find(
              (milestone) =>
                seconds >= milestone &&
                !warningMinutesPlayedRef.current.has(
                  milestone
                )
            )

          if (nextWarning !== undefined) {
            warningMinutesPlayedRef.current.add(
              nextWarning
            )

            playWarningSiren()
          }

        }, 1000)
    }


  // ========================================
  // TIMER STOP
  // ========================================

  const stopPickingTimer =
    () => {

      if (
        timerIntervalRef.current
      ) {

        clearInterval(
          timerIntervalRef.current
        )

        timerIntervalRef.current =
          null
      }

      if (
        timerStartRef.current
      ) {

        const seconds =
          Math.floor(
            (
              Date.now() -
              timerStartRef.current
            ) / 1000
          )

        setElapsedSeconds(
          seconds
        )

        setFinalCompletionTime(
          seconds
        )
      }
    }


  // ========================================
  // TIMER CLEANUP
  // ========================================

  useEffect(() => {

    return () => {

      if (
        timerIntervalRef.current
      ) {

        clearInterval(
          timerIntervalRef.current
        )
      }

    }

  }, [])


  // ========================================
  // CONFIRM ORDER
  // ========================================

  const confirmOrder =
    async () => {

      if (
        orderStatus !==
        'CREATING'
      ) {
        return
      }

      if (
        order.length ===
        0
      ) {

        setError(
          'Please add at least one product.'
        )

        return
      }

      setLoading(
        true
      )

      setError('')

      playClickSound()

      try {

        await fetchPickingRoute(
          mode,
          true
        )

        playOrderConfirmedSound()
        startPickingTimer()

        setOrderStatus(
          'PICKING'
        )

      } catch (
      err
      ) {

        setError(
          err.message ||
          'Unable to connect to the backend.'
        )

      } finally {

        setLoading(
          false
        )
      }
    }


  // ========================================
  // APPLY DIRECTION
  // ========================================

  const applyDirection =
    async () => {

      if (
        orderStatus !==
        'PICKING'
      ) {
        return
      }

      setDirectionLoading(
        true
      )

      setError('')
      playClickSound()

      try {

        await fetchPickingRoute(
          mode,
          false
        )

        setScannerMessage(
          ''
        )

        setScannerError(
          ''
        )

        setShowDemoBarcode(
          false
        )

      } catch (
      err
      ) {

        setError(
          err.message ||
          'Unable to update picking direction.'
        )

      } finally {

        setDirectionLoading(
          false
        )
      }
    }


  // ========================================
  // CURRENT ITEM
  // ========================================

  const currentItemIndex =
    useMemo(() => {

      return pickerItems.findIndex(
        (item) =>
          !pickedSkus.includes(
            item.sku
          )
      )

    }, [
      pickerItems,
      pickedSkus,
    ])


  const currentItem =
    currentItemIndex >=
      0

      ? pickerItems[
      currentItemIndex
      ]

      : null


  const currentFallbackInfo =
    getProductInfo(
      currentItem?.product_name
    )


  // ========================================
  // INSULATED BAG CHECK
  // ========================================

  const needsInsulatedBag =
    useMemo(() => {

      return pickerItems.some(
        (item) => {

          const zone =
            String(
              item.zone || ''
            )
              .trim()
              .toUpperCase()

          const bin =
            String(
              item.bin_address ||
              ''
            )
              .trim()
              .toUpperCase()

          return (
            zone ===
            'FROZEN' ||

            zone ===
            'FRESH' ||

            bin.startsWith(
              'FO-'
            ) ||

            bin.startsWith(
              'FR-'
            )
          )
        }
      )

    }, [
      pickerItems,
    ])


  // ========================================
  // RANDOM DELIVERY PARTNER
  // ========================================

  const assignDeliveryPartner =
    () => {

      if (
        deliveryPartners.length ===
        0
      ) {

        setDeliveryPartner(
          ''
        )

        return
      }

      let availablePartners =
        deliveryPartners

      if (
        deliveryPartner &&
        deliveryPartners.length >
        1
      ) {

        availablePartners =
          deliveryPartners.filter(
            (name) =>
              name !==
              deliveryPartner
          )
      }

      const randomIndex =
        Math.floor(
          Math.random() *
          availablePartners.length
        )

      setDeliveryPartner(
        availablePartners[
        randomIndex
        ]
      )
    }


  // ========================================
  // STOP CAMERA
  // ========================================

  const stopCameraScanner =
    () => {

      try {

        if (
          nativeScanFrameRef.current
        ) {
          window.clearTimeout(
            nativeScanFrameRef.current
          )

          nativeScanFrameRef.current =
            null
        }

        nativeBarcodeDetectorRef.current =
          null

        if (
          controlsRef.current
        ) {
          controlsRef.current.stop()
          controlsRef.current =
            null
        }

        const stream =
          cameraStreamRef.current ||
          videoRef.current?.srcObject

        if (stream) {
          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            )
        }

        cameraStreamRef.current =
          null

        if (
          videoRef.current
        ) {
          videoRef.current.srcObject =
            null
        }

      } catch (err) {

        console.error(
          'Camera stop error:',
          err
        )
      }

      cameraScanLockedRef.current =
        false

      cameraLastDetectionAtRef.current =
        0

      lastCameraBarcodeRef.current = {
        value: '',
        time: 0,
      }

      torchOnRef.current = false
      setTorchOn(false)

      setCameraOpen(false)
    }


  // ========================================
  // CURRENT ITEM CHANGE
  // ========================================

  useEffect(() => {

    stopCameraScanner()

    setManualBarcode('')
    setScannerMessage('')
    setScannerError('')
    setCameraError('')
    setShowDemoBarcode(
      false
    )

    if (
      orderStatus === 'PICKING' &&
      currentItem?.barcode
    ) {
      const timer =
        window.setTimeout(() => {
          startCameraScanner()
        }, 350)

      return () => {
        window.clearTimeout(timer)
        stopCameraScanner()
      }
    }
  }, [
    currentItem?.sku,
    orderStatus,
  ])


  // ========================================
  // BARCODE GENERATION
  // ========================================

  useEffect(() => {

    if (
      showDemoBarcode &&
      currentItem?.barcode &&
      barcodeRef.current
    ) {

      try {

        JsBarcode(
          barcodeRef.current,
          currentItem.barcode,
          {
            format:
              'CODE128',

            displayValue:
              true,

            fontSize:
              18,

            margin:
              10,

            height:
              80,
          }
        )

      } catch (
      err
      ) {

        console.error(
          'Barcode generation error:',
          err
        )
      }
    }

  }, [
    showDemoBarcode,
    currentItem?.barcode,
  ])


  // ========================================
  // VERIFY BARCODE
  // ========================================

  const verifyScannedBarcode =
    (
      scannedBarcode,
      source = 'manual'
    ) => {

      if (
        !currentItem
      ) {
        return false
      }

      const cleanedBarcode =
        String(
          scannedBarcode
        ).trim()

      if (
        !cleanedBarcode
      ) {
        return false
      }

      if (
        source === 'camera'
      ) {

        // Scanner-only duplicate guard:
        // keep the camera stream continuously running,
        // but ignore the same decode burst for 500ms.
        const now =
          Date.now()

        const previous =
          lastCameraBarcodeRef.current

        if (
          previous.value ===
          cleanedBarcode &&
          now - previous.time <
          500
        ) {
          return false
        }

        cameraLastDetectionAtRef.current =
          now

        lastCameraBarcodeRef.current = {
          value: cleanedBarcode,
          time: now,
        }
      }

      const expectedBarcode =
        currentItem
          .barcode
          ?.trim()

      if (
        !expectedBarcode
      ) {

        setScannerError(
          'Barcode is not available for this product.'
        )

        return false
      }

      if (
        cleanedBarcode !==
        expectedBarcode
      ) {

        playWrongSound()

        setScannerMessage('')

        setScannerError(
          '❌ Wrong Product — Scan Blocked'
        )

        setWrongScanMessage(
          `Wrong item scanned — ${cleanedBarcode}`
        )

        window.setTimeout(() => {
          setWrongScanMessage('')
        }, 2200)

        setManualBarcode('')

        return false
      }

      setWrongScanMessage('')

      playCorrectSound()

      const currentScanned =
        scannedCountsRef.current[
        currentItem.sku
        ] || 0

      const newScannedCount =
        Math.min(
          currentScanned + 1,
          currentItem.quantity
        )

      scannedCountsRef.current = {
        ...scannedCountsRef.current,
        [currentItem.sku]:
          newScannedCount,
      }

      setScannerError('')

      setManualBarcode('')

      setScannedCounts(
        (
          previous
        ) => ({
          ...previous,

          [currentItem.sku]:
            newScannedCount,
        })
      )

      // ------------------------------------
      // PRODUCT COMPLETE
      // ------------------------------------

      if (
        newScannedCount >=
        currentItem.quantity
      ) {

        setPickedSkus(
          (
            previous
          ) => {

            if (
              previous.includes(
                currentItem.sku
              )
            ) {
              return previous
            }

            return [
              ...previous,
              currentItem.sku,
            ]
          }
        )

        setScannerMessage(
          `✅ ${currentItem.product_name} verified — ${currentItem.quantity}/${currentItem.quantity} scanned`
        )

        stopCameraScanner()

        const pickedAfterThisScan =
          new Set(
            pickedSkus
          )

        pickedAfterThisScan.add(
          currentItem.sku
        )

        const allComplete =
          pickerItems.length > 0 &&
          pickerItems.every(
            (item) =>
              pickedAfterThisScan.has(
                item.sku
              )
          )

        if (
          allComplete
        ) {

          stopPickingTimer()
          playCompleteSound()
          assignDeliveryPartner()

          setOrderStatus(
            'COMPLETED'
          )
        }

      } else {

        setScannerMessage(
          `✅ Unit ${newScannedCount}/${currentItem.quantity} verified — remove it and show the next unit`
        )
      }

      return true
    }

  // ========================================
  // MANUAL AUTO VERIFY
  // ========================================

  const handleManualBarcodeChange =
    (
      event
    ) => {

      if (
        !currentItem
      ) {
        return
      }

      const value =
        event.target.value.trim()

      setManualBarcode(
        value
      )

      setScannerError(
        ''
      )

      if (
        !value
      ) {

        setScannerMessage(
          ''
        )

        return
      }

      const expectedBarcode =
        currentItem
          .barcode
          ?.trim()

      if (
        expectedBarcode &&
        value.length >=
        expectedBarcode.length
      ) {

        verifyScannedBarcode(
          value,
          'manual'
        )
      }
    }


  // ========================================
  // CAMERA SCANNER
  // ========================================

  const applyCameraQuality =
    async (track) => {

      if (!track) {
        return
      }

      try {
        const capabilities =
          track.getCapabilities?.() || {}

        if (
          capabilities.focusMode?.includes(
            'continuous'
          )
        ) {
          await track.applyConstraints({
            advanced: [
              {
                focusMode:
                  'continuous',
              },
            ],
          })
        }
      } catch {
        // Optional camera constraint.
      }

      try {
        const capabilities =
          track.getCapabilities?.() || {}

        if (
          typeof capabilities.zoom?.max ===
          'number'
        ) {
          const targetZoom =
            Math.min(
              1.25,
              capabilities.zoom.max
            )

          await track.applyConstraints({
            advanced: [
              {
                zoom: targetZoom,
              },
            ],
          })
        }
      } catch {
        // Zoom is optional.
      }

      try {
        const capabilities =
          track.getCapabilities?.() || {}

        if (
          capabilities.exposureMode?.includes(
            'continuous'
          )
        ) {
          await track.applyConstraints({
            advanced: [
              {
                exposureMode:
                  'continuous',
              },
            ],
          })
        }
      } catch {
        // Exposure control is optional.
      }
    }


  const startNativeBarcodeLoop =
    async (detector) => {

      const scan = async () => {

        if (
          !videoRef.current ||
          videoRef.current.readyState <
          2 ||
          !cameraStreamRef.current
        ) {
          nativeScanFrameRef.current =
            window.setTimeout(
              scan,
              120
            )
          return
        }

        const now =
          Date.now()

        try {
          const detected =
            await detector.detect(
              videoRef.current
            )

          if (
            detected.length > 0
          ) {

            cameraLastDetectionAtRef.current =
              now

            const value =
              detected[0]?.rawValue

            if (value) {
              verifyScannedBarcode(
                value,
                'camera'
              )
            }

          }

        } catch (err) {
          console.debug(
            'Native barcode detector:',
            err?.message || err
          )
        }

        nativeScanFrameRef.current =
          window.setTimeout(
            scan,
            60
          )
      }

      scan()
    }


  const startCameraScanner =
    async () => {

      if (
        !currentItem ||
        cameraStartRef.current
      ) {
        return
      }

      cameraStartRef.current =
        true

      setCameraError('')
      setScannerError('')
      setScannerMessage('')

      cameraScanLockedRef.current =
        false

      cameraLastDetectionAtRef.current =
        Date.now()

      try {

        if (
          !navigator.mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            'Camera access is not supported by this browser.'
          )
        }

        setCameraOpen(true)

        await new Promise(
          (resolve) =>
            requestAnimationFrame(
              resolve
            )
        )

        if (!videoRef.current) {
          throw new Error(
            'Camera preview could not be opened.'
          )
        }

        // A balanced stream: enough detail for normal
        // retail barcodes without making decoding heavy.
        const constraints = {
          audio: false,
          video: {
            facingMode: {
              ideal: 'environment',
            },
            width: {
              ideal: 1600,
              max: 1920,
            },
            height: {
              ideal: 900,
              max: 1080,
            },
            frameRate: {
              ideal: 30,
              max: 30,
            },
            resizeMode: 'crop-and-scale',
          },
        }

        const stream =
          await navigator.mediaDevices
            .getUserMedia(
              constraints
            )

        cameraStreamRef.current =
          stream

        videoRef.current.srcObject =
          stream

        await videoRef.current.play()

        const track =
          stream.getVideoTracks()[0]

        await applyCameraQuality(
          track
        )

        // Prefer native BarcodeDetector when
        // supported by the browser; it is often
        // faster for mobile 1D/2D scans.
        let nativeDetector =
          null

        try {
          if (
            'BarcodeDetector' in
            window
          ) {

            const supported =
              window.BarcodeDetector
                .getSupportedFormats
                ? await window.BarcodeDetector
                  .getSupportedFormats()
                : []

            const desiredFormats = [
              'code_128',
              'code_39',
              'code_93',
              'ean_13',
              'ean_8',
              'upc_a',
              'upc_e',
              'itf',
              'codabar',
              'qr_code',
              'data_matrix',
              'pdf417',
              'aztec',
            ]

            const formats =
              desiredFormats.filter(
                (format) =>
                  supported.length === 0 ||
                  supported.includes(format)
              )

            nativeDetector =
              formats.length > 0
                ? new window.BarcodeDetector({
                  formats,
                })
                : new window.BarcodeDetector()
          }
        } catch {
          nativeDetector = null
        }

        if (nativeDetector) {

          nativeBarcodeDetectorRef.current =
            nativeDetector

          await startNativeBarcodeLoop(
            nativeDetector
          )

        } else {

          // ZXing fallback for browsers without
          // native BarcodeDetector support.
          const codeReader =
            new BrowserMultiFormatReader()

          if (
            'timeBetweenDecodingAttempts' in
            codeReader
          ) {
            codeReader.timeBetweenDecodingAttempts =
              35
          }

          const controls =
            await codeReader
              .decodeFromVideoElement(
                videoRef.current,
                (
                  result,
                  scanError
                ) => {

                  if (result) {
                    cameraLastDetectionAtRef.current =
                      Date.now()

                    if (
                      !cameraScanLockedRef.current
                    ) {
                      verifyScannedBarcode(
                        result
                          .getText()
                          .trim(),
                        'camera'
                      )
                    }
                  } else if (
                    cameraScanLockedRef.current &&
                    Date.now() -
                    cameraLastDetectionAtRef.current >
                    650
                  ) {
                    cameraScanLockedRef.current =
                      false

                    lastCameraBarcodeRef.current = {
                      value: '',
                      time: 0,
                    }
                  }

                  if (
                    scanError &&
                    scanError.name !==
                    'NotFoundException'
                  ) {
                    console.debug(
                      'ZXing scanner:',
                      scanError.message
                    )
                  }
                }
              )

          controlsRef.current =
            controls
        }

      } catch (err) {

        console.error(
          'Camera scanner error:',
          err
        )

        setCameraOpen(false)

        setCameraError(
          err.message ||
          'Unable to start the camera.'
        )

        const stream =
          cameraStreamRef.current

        if (stream) {
          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            )
        }

        cameraStreamRef.current =
          null
      } finally {
        cameraStartRef.current =
          false
      }
    }


  // ========================================


  // ========================================
  // CAMERA TORCH
  // ========================================

  const toggleTorch = async () => {

    const stream =
      cameraStreamRef.current ||
      videoRef.current?.srcObject

    const track =
      stream?.getVideoTracks?.()[0]

    if (!track) {
      return
    }

    try {
      const capabilities =
        track.getCapabilities?.() || {}

      if (!capabilities.torch) {
        setCameraError(
          'Torch is not supported on this camera.'
        )
        return
      }

      torchOnRef.current =
        !torchOnRef.current

      setTorchOn(
        torchOnRef.current
      )

      await track.applyConstraints({
        advanced: [
          {
            torch:
              torchOnRef.current,
          },
        ],
      })

      setCameraError('')

    } catch (err) {
      console.debug(
        'Torch error:',
        err
      )
    }
  }


  // ========================================
  // START NEW ORDER
  // ========================================

  const startNewOrder =
    () => {

      playClickSound()
      stopBackgroundSound()
      stopCameraScanner()

      if (
        timerIntervalRef.current
      ) {

        clearInterval(
          timerIntervalRef.current
        )

        timerIntervalRef.current =
          null
      }

      timerStartRef.current =
        null

      setElapsedSeconds(
        0
      )

      setFinalCompletionTime(
        null
      )

      warningMinutesPlayedRef.current =
        new Set()

      setCategory('')
      setProduct('')
      setQuantity(1)

      setOrder([])

      setMode(
        'default'
      )

      setPickerItems(
        []
      )

      setPickedSkus(
        []
      )

      scannedCountsRef.current = {}

      setScannedCounts(
        {}
      )

      setManualBarcode(
        ''
      )

      setScannerMessage(
        ''
      )

      setScannerError(
        ''
      )

      setWrongScanMessage(
        ''
      )

      setCameraOpen(
        false
      )

      setCameraError(
        ''
      )

      setShowDemoBarcode(
        false
      )

      setDistance(
        null
      )

      setLoading(
        false
      )

      setDirectionLoading(
        false
      )

      setError(
        ''
      )

      setDeliveryPartner(
        ''
      )

      setOrderStatus(
        'CREATING'
      )
    }


  // ========================================
  // PROGRESS
  // ========================================

  const progress =
    pickerItems.length > 0

      ? Math.round(
        (
          pickedSkus.length /
          pickerItems.length
        ) *
        100
      )

      : 0


  const scanCount =
    currentItem

      ? scannedCounts[
      currentItem.sku
      ] || 0

      : 0


  const timerWarning =
    elapsedSeconds >=
    300


  // ========================================
  // UI
  // ========================================

  return (
    <div className="app">

      {/* ====================================
          HEADER
          ==================================== */}

      <div className="card">

        <h1>
          Warehouse Picker
        </h1>

        <p>
          Smart Picking Optimization System
        </p>

        {orderStatus ===
          'CREATING' && (
            <p>
              🟢{' '}
              <strong>
                New Order
              </strong>
            </p>
          )}

        {orderStatus ===
          'PICKING' && (
            <p>
              🔒{' '}
              <strong>
                Order Locked — Picking In Progress
              </strong>
            </p>
          )}

        {orderStatus ===
          'COMPLETED' && (
            <p>
              ✅{' '}
              <strong>
                Order Completed — Picker Work Finished
              </strong>
            </p>
          )}

      </div>


      {/* ====================================
          CREATE ORDER
          ==================================== */}

      {orderStatus ===
        'CREATING' && (
          <>

            <div className="card">

              <h2>
                Create Customer Order
              </h2>

              <label>
                <strong>
                  Category
                </strong>
              </label>

              <br />

              <select
                value={
                  category
                }
                onChange={(e) =>
                  handleCategoryChange(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Category
                </option>

                {Object.keys(
                  categories
                ).map(
                  (
                    categoryName
                  ) => (
                    <option
                      key={
                        categoryName
                      }
                      value={
                        categoryName
                      }
                    >
                      {
                        categoryName
                      }
                    </option>
                  )
                )}

              </select>

              <br />
              <br />

              <label>
                <strong>
                  Product
                </strong>
              </label>

              <br />

              <select
                value={
                  product
                }
                onChange={(e) =>
                  setProduct(
                    e.target.value
                  )
                }
                disabled={
                  !category
                }
              >

                <option value="">
                  {
                    category
                      ? 'Select Product'
                      : 'Select Category First'
                  }
                </option>

                {category &&
                  categories[
                    category
                  ].map(
                    (
                      productName
                    ) => (
                      <option
                        key={
                          productName
                        }
                        value={
                          productName
                        }
                      >
                        {
                          productName
                        }
                      </option>
                    )
                  )}

              </select>

              <br />
              <br />

              <label>
                <strong>
                  Quantity
                </strong>
              </label>

              <br />

              <button
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }
              >
                −
              </button>

              <span
                style={{
                  margin:
                    '0 15px',

                  fontSize:
                    '18px',

                  fontWeight:
                    'bold',
                }}
              >
                {
                  quantity
                }
              </span>

              <button
                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }
              >
                +
              </button>

              <br />
              <br />

              <button
                onClick={
                  addProduct
                }
              >
                + Add Product
              </button>

            </div>


            {/* =================================
              ORDER SUMMARY
              ================================= */}

            {order.length >
              0 && (
                <div className="card">

                  <h2>
                    Order Summary
                  </h2>

                  {order.map(
                    (
                      item,
                      index
                    ) => {

                      const info =
                        getProductInfo(
                          item.product_name
                        )

                      return (
                        <div
                          className="item-row"
                          key={
                            item.product_name
                          }
                        >

                          {info.photo ? (

                            <img
                              src={
                                info.photo
                              }
                              alt={
                                item.product_name
                              }
                              style={{
                                width:
                                  '82px',

                                height:
                                  '82px',

                                objectFit:
                                  'contain',

                                borderRadius:
                                  '12px',

                                margin:
                                  0,

                                padding:
                                  '8px',

                                flexShrink:
                                  0,
                              }}
                            />

                          ) : (

                            <div
                              style={{
                                width:
                                  '82px',

                                height:
                                  '82px',

                                borderRadius:
                                  '12px',

                                background:
                                  '#f3f4f6',

                                display:
                                  'flex',

                                alignItems:
                                  'center',

                                justifyContent:
                                  'center',

                                fontSize:
                                  '12px',

                                color:
                                  '#98a2b3',

                                flexShrink:
                                  0,
                              }}
                            >
                              No Image
                            </div>

                          )}

                          <span
                            style={{
                              flex:
                                1,

                              minWidth:
                                0,
                            }}
                          >

                            <strong>
                              {
                                item.product_name
                              }
                            </strong>

                            <br />

                            <small>
                              Size:{' '}
                              <strong>
                                {
                                  info.size ||
                                  'Standard'
                                }
                              </strong>
                            </small>

                            <br />

                            <small>
                              Quantity:{' '}
                              {
                                item.quantity
                              }
                            </small>

                          </span>

                          <div>

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  index
                                )
                              }
                            >
                              −
                            </button>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  index
                                )
                              }
                            >
                              +
                            </button>

                            <button
                              onClick={() =>
                                removeProduct(
                                  index
                                )
                              }
                            >
                              Remove
                            </button>

                          </div>

                        </div>
                      )
                    }
                  )}

                  {error && (
                    <p>
                      <strong>
                        {
                          error
                        }
                      </strong>
                    </p>
                  )}

                  <br />

                  <button
                    onClick={
                      confirmOrder
                    }
                    disabled={
                      loading
                    }
                  >
                    {
                      loading
                        ? 'Processing...'
                        : '🔒 Confirm & Lock Order'
                    }
                  </button>

                </div>
              )}

          </>
        )}


      {/* ====================================
          PICKING DASHBOARD
          ==================================== */}

      {orderStatus ===
        'PICKING' &&
        pickerItems.length >
        0 && (
          <>

            {/* =================================
              DIRECTION + TIMER
              ================================= */}

            <div
              style={{
                display:
                  'grid',

                gridTemplateColumns:
                  'minmax(0, 1fr) 220px',

                gap:
                  '16px',

                alignItems:
                  'stretch',

                marginTop:
                  '20px',
              }}
            >

              <div
                className="card"
                style={{
                  marginTop:
                    0,
                }}
              >

                <h2>
                  🧭 Picking Direction
                </h2>

                <label>

                  <input
                    type="radio"
                    value="default"
                    checked={
                      mode ===
                      'default'
                    }
                    onChange={(e) =>
                      setMode(
                        e.target.value
                      )
                    }
                    disabled={
                      directionLoading
                    }
                  />

                  {' '}Default

                </label>

                {' '}

                <label>

                  <input
                    type="radio"
                    value="reverse"
                    checked={
                      mode ===
                      'reverse'
                    }
                    onChange={(e) =>
                      setMode(
                        e.target.value
                      )
                    }
                    disabled={
                      directionLoading
                    }
                  />

                  {' '}Reverse

                </label>

                <br />
                <br />

                <button
                  onClick={
                    applyDirection
                  }
                  disabled={
                    directionLoading
                  }
                >
                  {
                    directionLoading
                      ? 'Recalculating...'
                      : 'Apply Direction'
                  }
                </button>

                <div className="route">

                  <strong>
                    START
                  </strong>

                  {' → '}

                  {
                    pickerItems.map(
                      (
                        item,
                        index
                      ) => (
                        <span
                          key={`${item.sku}-${index}`}
                        >

                          <strong>
                            {
                              item.bin_address
                            }
                          </strong>

                          {
                            index <
                            pickerItems.length -
                            1 && (
                              <span>
                                {' → '}
                              </span>
                            )
                          }

                        </span>
                      )
                    )
                  }

                  {' → '}

                  <strong>
                    COUNTER
                  </strong>

                </div>

                <p>
                  Estimated Walking Distance:{' '}
                  <strong>
                    {
                      distance
                    } meters
                  </strong>
                </p>

              </div>


              {/* TIMER */}

              <div
                className="card"
                style={{
                  marginTop:
                    0,

                  textAlign:
                    'center',

                  display:
                    'flex',

                  flexDirection:
                    'column',

                  justifyContent:
                    'center',

                  minHeight:
                    '100%',
                }}
              >

                <div
                  style={{
                    fontSize:
                      '13px',

                    fontWeight:
                      800,

                    color:
                      '#667085',

                    textTransform:
                      'uppercase',

                    letterSpacing:
                      '0.06em',
                  }}
                >
                  Picking Timer
                </div>

                <div
                  style={{
                    marginTop:
                      '8px',

                    fontSize:
                      '34px',

                    fontWeight:
                      900,

                    color:
                      timerWarning
                        ? '#b42318'
                        : '#172033',
                  }}
                >
                  {
                    formatTime(
                      elapsedSeconds
                    )
                  }
                </div>

                {
                  timerWarning && (
                    <div
                      style={{
                        marginTop:
                          '6px',

                        fontSize:
                          '12px',

                        fontWeight:
                          800,

                        color:
                          '#b42318',
                      }}
                    >
                      ⚠️ Picking time exceeded 5 minutes
                    </div>
                  )
                }

              </div>

            </div>


            {/* =================================
              CURRENT PRODUCT
              ================================= */}

            {currentItem && (
              <div className="card">

                <h2>
                  📦 Current Product
                </h2>

                <div className="current-product-layout">

                  <div>

                    {
                      currentItem.photo ||
                        currentFallbackInfo.photo
                        ? (

                          <img
                            className="current-product-image"
                            src={
                              currentItem.photo ||
                              currentFallbackInfo.photo
                            }
                            alt={
                              currentItem.product_name
                            }
                          />

                        ) : (

                          <div className="current-product-placeholder">
                            No Image
                          </div>

                        )
                    }

                  </div>


                  <div
                    className="current-product-info"
                  >

                    <h2>
                      {
                        currentItem.product_name
                      }
                    </h2>

                    <div
                      className="product-size"
                    >
                      Size:{' '}
                      {
                        currentItem.size ||
                        currentFallbackInfo.size ||
                        'Standard'
                      }
                    </div>

                    <p
                      style={{
                        marginTop: '18px',
                        marginBottom: '14px',
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 900,
                          color: '#667085',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '4px',
                        }}
                      >
                        BIN
                      </span>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '32px',
                          lineHeight: 1.05,
                          fontWeight: 900,
                          color: '#0b63ce',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {
                          currentItem.bin_address
                        }
                      </strong>
                    </p>

                    <p>
                      Quantity:{' '}
                      <strong>
                        {
                          currentItem.quantity
                        }
                      </strong>
                    </p>

                    <p>
                      Scanned:{' '}
                      <strong>
                        {
                          scanCount
                        } / {
                          currentItem.quantity
                        }
                      </strong>
                    </p>

                    {currentItem.quantity > 1 && (
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#667085',
                        }}
                      >
                        Scan this product {currentItem.quantity} times — one physical unit per scan.
                      </p>
                    )}

                    <p>
                      Zone:{' '}
                      <strong>
                        {
                          currentItem.zone
                        }
                      </strong>
                    </p>

                  </div>

                </div>


                <hr />


                {/* PRODUCT SCAN */}

                <div
                  className="product-scan-section"
                >

                  <h3>
                    🔎 Product Scan
                  </h3>

                  <div
                    className="product-scan-area"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound()

                        if (cameraOpen) {
                          stopCameraScanner()
                        } else {
                          startCameraScanner()
                        }
                      }}
                    >
                      {
                        cameraOpen
                          ? '⏹ Stop Camera'
                          : '📷 Scanner'
                      }
                    </button>

                    <input
                      type="text"
                      value={
                        manualBarcode
                      }
                      onChange={
                        handleManualBarcodeChange
                      }
                      placeholder="Enter barcode"
                      inputMode="numeric"
                      autoComplete="off"
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        boxSizing: 'border-box',
                      }}
                    />

                    {cameraOpen && (
                      <>
                        <div
                          className="camera-preview"
                          style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '420px',
                            margin: '12px auto 6px',
                            display: 'flex',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderRadius: '14px',
                            background: '#000',
                          }}
                        >

                          <video
                            ref={
                              videoRef
                            }
                            muted
                            autoPlay
                            playsInline
                            style={{
                              display: 'block',
                              width: '100%',
                              maxWidth: '420px',
                              aspectRatio: '16 / 9',
                              objectFit: 'cover',
                              background: '#000',
                            }}
                          />

                          <div
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '12px',
                              padding: '5px 9px',
                              borderRadius: '999px',
                              background: 'rgba(0,0,0,0.52)',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              pointerEvents: 'none',
                            }}
                          >
                            Full-frame scan
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            playClickSound()
                            toggleTorch()
                          }}
                          style={{
                            marginTop: '4px',
                          }}
                        >
                          🔦 {torchOn ? 'Turn Torch Off' : 'Torch'}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound()

                        setShowDemoBarcode(
                          !showDemoBarcode
                        )
                      }}
                    >
                      {
                        showDemoBarcode
                          ? 'Hide Demo Barcode'
                          : 'Show Demo Barcode'
                      }
                    </button>


                    {showDemoBarcode && (
                      <div
                        className="demo-barcode-panel"
                      >

                        <svg
                          ref={
                            barcodeRef
                          }
                        />

                      </div>
                    )}

                  </div>


                  {cameraError && (
                    <p>
                      <strong>
                        {
                          cameraError
                        }
                      </strong>
                    </p>
                  )}

                  {scannerMessage && (
                    <p>
                      <strong>
                        {
                          scannerMessage
                        }
                      </strong>
                    </p>
                  )}

                  {scannerError && (
                    <p
                      style={{
                        margin: '8px auto 0',
                        maxWidth: '420px',
                        textAlign: 'center',
                        color: '#b42318',
                        fontWeight: 800,
                      }}
                    >
                      <strong>
                        {
                          scannerError
                        }
                      </strong>
                    </p>
                  )}

                  {wrongScanMessage && (
                    <div
                      role="alert"
                      style={{
                        margin: '10px auto 0',
                        maxWidth: '420px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        background: '#fff1f0',
                        border: '1px solid #f4c7c3',
                        color: '#b42318',
                        fontSize: '13px',
                        fontWeight: 800,
                        boxSizing: 'border-box',
                      }}
                    >
                      🚫 {wrongScanMessage}
                    </div>
                  )}

                  <p>
                    🔒 Next product remains locked until
                    the current product is fully verified.
                  </p>

                </div>

              </div>
            )}


            {/* =================================
              PICKER LIST
              ================================= */}

            <div
              className="card"
            >

              <h2>
                📋 Picker List
              </h2>

              <p
                className="progress"
              >
                Progress:{' '}
                {
                  pickedSkus.length
                } /{' '}
                {
                  pickerItems.length
                } picked (
                {progress}%)
              </p>

              {
                pickerItems.map(
                  (
                    item,
                    index
                  ) => {

                    const itemPicked =
                      pickedSkus.includes(
                        item.sku
                      )

                    const itemScanCount =
                      scannedCounts[
                      item.sku
                      ] || 0

                    const info =
                      getProductInfo(
                        item.product_name
                      )

                    return (
                      <div
                        className="item-row"
                        key={`${item.sku}-${index}`}
                      >

                        {
                          (
                            item.photo ||
                            info.photo
                          ) && (

                            <img
                              src={
                                item.photo ||
                                info.photo
                              }
                              alt={
                                item.product_name
                              }
                              style={{
                                width:
                                  '64px',

                                height:
                                  '64px',

                                objectFit:
                                  'contain',

                                borderRadius:
                                  '10px',

                                margin:
                                  0,

                                flexShrink:
                                  0,
                              }}
                            />

                          )
                        }

                        <span
                          style={{
                            flex:
                              1,

                            minWidth:
                              0,
                          }}
                        >

                          <strong>
                            {
                              index + 1
                            }.{' '}
                            {
                              item.product_name
                            }
                          </strong>

                          <br />

                          <small>
                            Size:{' '}
                            {
                              item.size ||
                              info.size ||
                              'Standard'
                            }
                          </small>

                          <br />

                          <small>
                            SKU:{' '}
                            {
                              item.sku
                            }
                          </small>

                          <br />

                          <small>
                            Qty:{' '}
                            {
                              item.quantity
                            }
                          </small>

                          <br />

                          <small>
                            Scan:{' '}
                            {
                              itemScanCount
                            } / {
                              item.quantity
                            }
                          </small>

                          <br />

                          <div
                            style={{
                              marginTop: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: '#667085',
                                textTransform: 'uppercase',
                              }}
                            >
                              BIN
                            </span>
                            <div
                              style={{
                                fontSize: '20px',
                                lineHeight: 1.1,
                                fontWeight: 900,
                                color: '#0b63ce',
                              }}
                            >
                              {
                                item.bin_address
                              }
                            </div>
                          </div>

                          <br />

                          <small>
                            Zone:{' '}
                            {
                              item.zone
                            }
                          </small>

                        </span>

                        <button
                          disabled
                        >
                          {
                            itemPicked
                              ? '✅ Verified'
                              : currentItem?.sku ===
                                item.sku
                                ? '🔎 Scan Required'
                                : '🔒 Locked'
                          }
                        </button>

                      </div>
                    )
                  }
                )
              }

            </div>

          </>
        )}


      {/* ====================================
          ORDER COMPLETE
          ==================================== */}

      {
        orderStatus ===
        'COMPLETED' && (

          <div
            className="card complete"
          >

            <h2>
              ✅ Order Complete
            </h2>

            <p>
              All products have been
              verified successfully.
            </p>


            {/* COMPLETION TIME */}

            <div
              style={{
                display:
                  'inline-flex',

                flexDirection:
                  'column',

                gap:
                  '4px',

                margin:
                  '6px 0 14px',

                padding:
                  '10px 14px',

                borderRadius:
                  '12px',

                background:
                  'rgba(255,255,255,0.75)',

                border:
                  '1px solid #d1fae5',
              }}
            >

              <span
                style={{
                  fontSize:
                    '11px',

                  fontWeight:
                    800,

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.05em',

                  color:
                    '#667085',
                }}
              >
                Picker Completion Time
              </span>

              <strong
                style={{
                  fontSize:
                    '18px',

                  color:
                    '#166534',
                }}
              >
                Order completed in{' '}
                {
                  formatTime(
                    finalCompletionTime ??
                    elapsedSeconds
                  )
                }
              </strong>

            </div>


            {/* SPECIAL HANDLING */}

            {
              needsInsulatedBag && (

                <div
                  className="special-handling"
                  style={{
                    marginTop:
                      '12px',

                    padding:
                      '16px',

                    borderRadius:
                      '14px',

                    background:
                      '#eff6ff',

                    border:
                      '1px solid #bfdbfe',
                  }}
                >

                  <h3
                    style={{
                      marginTop:
                        0,
                    }}
                  >
                    ❄️ Special Handling Required
                  </h3>

                  <p>
                    Use an insulated bag for this parcel.
                  </p>

                </div>

              )
            }


            <hr />


            {/* RANDOM DELIVERY NAME */}

            <div
              style={{
                marginTop:
                  '8px',

                padding:
                  '16px 18px',

                borderRadius:
                  '14px',

                background:
                  '#f8fafc',

                border:
                  '1px solid #e2e8f0',
              }}
            >

              <div
                style={{
                  fontSize:
                    '13px',

                  fontWeight:
                    800,

                  color:
                    '#667085',

                  marginBottom:
                    '6px',
                }}
              >
                📦 Handover the Parcel To
              </div>

              <div
                style={{
                  fontSize:
                    '22px',

                  fontWeight:
                    900,

                  color:
                    '#166534',
                }}
              >
                {
                  deliveryPartner ||
                  'Assigning delivery partner...'
                }
              </div>

            </div>


            <p
              style={{
                marginTop:
                  '12px',

                color:
                  '#667085',

                fontSize:
                  '13px',
              }}
            >
              Picker work is complete. Handover is handled separately by the delivery team.
            </p>


            <button
              onClick={
                startNewOrder
              }
            >
              🆕 Start New Order
            </button>

          </div>
        )
      }

    </div>
  )
}


export default App