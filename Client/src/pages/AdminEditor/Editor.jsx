import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/product.api";
import { useEditorHistory } from "./hooks/useEditorHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import EditorHeader from "./components/EditorHeader";
import EditorCanvas from "./components/EditorCanvas";
import EditorLayersPanel from "./components/EditorLayersPanel";
import EditorPropertiesPanel from "./components/EditorPropertiesPanel";
import {
  getLayersByProductId,
} from "../../api/layers.api";

// Import helpers
import * as editorHelpers from "./helper/helping";

function Editor() {
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { editId, mockupId } = useParams();

  // States
  const [mockup, setMockup] = useState(null);
  const [layers, setLayers] = useState([]);
  const [showPrintareaSelect, setShowPrintareaSelect] = useState(false);
  const [printAreas, setPrintAreas] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [draggingCorner, setDraggingCorner] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('canvas');
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [productMockups, setProductMockups] = useState([]);
  const [selectedMockup, setSelectedMockup] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const printAreaFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const innerCanvasRef = useRef(null);

  // History hook
  const { recordHistory, undo, redo } = useEditorHistory();

  // Selected layer
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  // Helper functions with dependencies
  const getCanvasSize = () => editorHelpers.getCanvasSize(layers);

  const setLayersWithHistory = (newLayers, options = { recordHistory: true }) => {
    setLayers(prev => {
      if (options.recordHistory) {
        recordHistory(prev);
      }
      return typeof newLayers === "function" ? newLayers(prev) : newLayers;
    });
  };

  const updateLayer = (id, updates) => {
    editorHelpers.updateLayer(id, updates, layers, setLayersWithHistory);
  };

  const removeLayer = (id) => {
    editorHelpers.removeLayer(id, layers, setLayersWithHistory, setSelectedLayerId, selectedLayerId);
  };

  const duplicateLayer = () => {
    editorHelpers.duplicateLayer(selectedLayerId, layers, setLayersWithHistory, setSelectedLayerId);
  };

  const toggleLayerVisibility = (id) => {
    editorHelpers.toggleLayerVisibility(id, setLayersWithHistory);
  };

  const startRotation = (e, layerId) => {
    editorHelpers.startRotation(e, layerId, layers, updateLayer, innerCanvasRef, scale);
  };

  const addPrintAreaToCanvas = (printArea) => {
    editorHelpers.addPrintAreaToCanvas(printArea, layers, setLayersWithHistory, setSelectedLayerId, getCanvasSize);
  };

  const handlePrintAreaImageUpload = (e) => {
    editorHelpers.handlePrintAreaImageUpload(e, selectedLayer, updateLayer, printAreaFileInputRef);
  };

  const removePrintAreaImage = () => {
    editorHelpers.removePrintAreaImage(selectedLayer, updateLayer);
  };

  const triggerPrintAreaImageUpload = () => {
    editorHelpers.triggerPrintAreaImageUpload(printAreaFileInputRef);
  };

  const startCornerDrag = (e, layerId, cornerIndex) => {
    editorHelpers.startCornerDrag(e, layerId, cornerIndex, layers, updateLayer, innerCanvasRef, scale, getCanvasSize, setDraggingCorner);
  };

  const exportAsImage = async (format = "png") => {
    await editorHelpers.exportAsImage(format, innerCanvasRef);
  };

  const toggleLockSelected = () => {
    editorHelpers.toggleLockSelected(selectedLayer, updateLayer);
  };

  const toggleLockById = (id) => {
    editorHelpers.toggleLockById(id, setLayersWithHistory);
  };

  const handleZoomIn = () => setScale(prev => Math.min(3, prev + 0.1));
  const handleZoomOut = () => setScale(prev => Math.max(0.3, prev - 0.1));
  const handleZoomReset = () => {
    setScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  const handleZoomToFit = () => {
    editorHelpers.handleZoomToFit(canvasRef, mockup, getCanvasSize, setScale, setCanvasOffset);
  };

  const handleUndo = () => editorHelpers.handleUndo(undo, layers, setLayers);
  const handleRedo = () => editorHelpers.handleRedo(redo, layers, setLayers);

  const bringForward = (id) => {
    editorHelpers.bringForward(id, setLayersWithHistory);
  };

  const sendBackward = (id) => {
    editorHelpers.sendBackward(id, setLayersWithHistory);
  };

  const addNewTextLayer = () => {
    editorHelpers.addNewTextLayer(setLayersWithHistory, setSelectedLayerId, getCanvasSize);
  };

  const addImageLayerFromFile = (file) => {
    editorHelpers.addImageLayerFromFile(file, setLayersWithHistory, setSelectedLayerId, getCanvasSize, fileInputRef);
  };

  const handleFileInputChange = (e) => {
    editorHelpers.handleFileInputChange(e, addImageLayerFromFile, fileInputRef);
  };

  const addImageLayerButton = () => {
    editorHelpers.addImageLayerButton(fileInputRef);
  };

  const onSave = async () => {
    await editorHelpers.onSave({
      editId,
      selectedMockup,
      layers,
      setIsSaving,
      navigate,
      getCanvasSize,
      BaseUrl,
      setLayers,
      selectedLayerId
    });
  };

  const loadEditorData = async () => {
    await editorHelpers.loadEditorData({
      editId,
      selectedMockup,
      setMockup,
      setLayers,
      setSelectedLayerId,
      getLayersByProductId
    });
  };

  // Load mockup from localStorage
  useEffect(() => {
    const savedMockup = localStorage.getItem("mockupToEdit");
    if (savedMockup) {
      const parsed = JSON.parse(savedMockup);
      setMockup(parsed);
      const img = new Image();
      img.onload = function () {
        const naturalWidth = this.naturalWidth;
        const naturalHeight = this.naturalHeight;
        setLayersWithHistory([
          {
            id: "layer-bg",
            type: "background",
            src: parsed.url,
            x: 0,
            y: 0,
            width: naturalWidth,
            height: naturalHeight,
            _naturalWidth: naturalWidth,
            _naturalHeight: naturalHeight,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: true
          },
        ], { recordHistory: false });
        setSelectedLayerId("layer-bg");
      };
      img.src = parsed.url;
    }
  }, []);

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!editId) return;
      const product = await getProductById(editId);
      if (product) {
        setPrintAreas(product.Printareas || []);
        if (product.mockupIds?.length) {
          setProductMockups(product.mockupIds);
        }
      }
    };
    fetchProduct();
  }, [editId]);

  // Load mockup data when mockupId changes
  useEffect(() => {
    if (!productMockups.length || !mockupId) return;
    const mockup = productMockups.find((m) => m._id === mockupId);
    if (!mockup) return;

    const img = new Image();
    img.onload = function () {
      const naturalWidth = this.naturalWidth;
      const naturalHeight = this.naturalHeight;
      setLayersWithHistory([
        {
          id: "layer-bg",
          type: "background",
          src: mockup.mockupImage.url,
          x: 0,
          y: 0,
          width: naturalWidth,
          height: naturalHeight,
          _naturalWidth: naturalWidth,
          _naturalHeight: naturalHeight,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: true
        },
      ], { recordHistory: false });
      setSelectedLayerId("layer-bg");
    };
    img.src = mockup.mockupImage.url;
    setSelectedMockup(mockup);
  }, [productMockups, mockupId]);

  // Load saved layers
  useEffect(() => {
    loadEditorData();
  }, [editId, selectedMockup]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    selectedLayerId,
    layers,
    updateLayer,
    removeLayer,
    duplicateLayer,
    exportAsImage,
    toggleLockSelected,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleUndo,
    handleRedo,
  });

  // Operations object
  const operations = {
    addNewTextLayer,
    addImageLayerFromFile,
    handleFileInputChange,
    addImageLayerButton,
    updateLayer,
    removeLayer,
    bringForward,
    sendBackward,
    duplicateLayer,
    toggleLayerVisibility,
    startRotation,
    addPrintAreaToCanvas,
    handlePrintAreaImageUpload,
    removePrintAreaImage,
    triggerPrintAreaImageUpload,
    startCornerDrag,
    exportAsImage,
    toggleLockSelected,
    toggleLockById,
    onSave,
    isSaving,
    setIsSaving,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomToFit,
    handleUndo,
    handleRedo,
    setLayers: setLayersWithHistory,
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <EditorHeader
        showPrintareaSelect={showPrintareaSelect}
        setShowPrintareaSelect={setShowPrintareaSelect}
        printAreas={printAreas}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        scale={scale}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        fileInputRef={fileInputRef}
        operations={operations}
      />

      <div className="flex-1 flex overflow-hidden">
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        )}

        <EditorLayersPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          operations={operations}
        />

        <div className={`flex-1 ${activePanel === 'canvas' ? 'flex' : 'hidden'} lg:flex items-center justify-center bg-gray-700 p-2 lg:p-4`}>
          <EditorCanvas
            mockup={mockup}
            layers={layers}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            scale={scale}
            showGrid={showGrid}
            gridSize={gridSize}
            getCanvasSize={getCanvasSize}
            canvasRef={canvasRef}
            innerCanvasRef={innerCanvasRef}
            draggingCorner={draggingCorner}
            operations={operations}
            activePanel={activePanel}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
          />
        </div>

        <EditorPropertiesPanel
          selectedLayer={selectedLayer}
          activePanel={activePanel}
          printAreaFileInputRef={printAreaFileInputRef}
          operations={operations}
          setShowGrid={setShowGrid}
        />
      </div>
    </div>
  );
}

export default Editor;