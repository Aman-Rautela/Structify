import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Box, Download, RefreshCcw, Share2, X } from "lucide-react";
import Button from "../../components/ui/Button";

const VisualiserId = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { initialImage, initialRender, name } = location.state || {};

    // ✅ image-keyed guard instead of one-shot boolean
    const lastGeneratedImageRef = useRef<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(initialRender || null);

    const handleBack = () => navigate("/");

    const runGeneration = useCallback(async () => {
        if (!initialImage) return;
        try {
            setIsProcessing(true);
            console.log("Starting generation...");
            const result = await generate3DView({ sourceImage: initialImage });
            console.log("Generation result:", result);
            if (result.renderedImage) {
                setCurrentImage(result.renderedImage);
            } else {
                console.warn("No rendered image returned from Puter");
            }
        } catch (error) {
            console.error(`Generation failed - ${error}`);
        } finally {
            setIsProcessing(false);
        }
    }, [initialImage]);

    useEffect(() => {
        if (!initialImage) {
            navigate("/", { replace: true });
            return;
        }

        // ✅ skip only if this exact image was already generated
        if (lastGeneratedImageRef.current === initialImage) return;
        lastGeneratedImageRef.current = initialImage; // ✅ store image, not just true

        if (initialRender) {
            setCurrentImage(initialRender);
        }

        runGeneration();
    }, [initialImage, initialRender, runGeneration, navigate]);

    return (
        <div className="visualizer">
            <nav className="topbar">
                <div className="brand">
                    <Box className="logo" />
                    <span className="name">Structify</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
                    <X className="icon" />
                    Exit Editor
                </Button>
            </nav>
            <section className="content">
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-meta">
                            <p>Project</p>
                            <h2>Untitled Project</h2>
                            <p className="note">Created by you</p>
                        </div>
                        <div className="panel-actions">
                            <Button size="sm" className="export" disabled={!currentImage} onClick={() => {}}>
                                <Download className="w-4 h-4 mr-2" />Export
                            </Button>
                            <Button size="sm" className="share" disabled={!currentImage} onClick={() => {}}>
                                <Share2 className="w-4 h-4 mr-2" />Share
                            </Button>
                        </div>
                    </div>
                    <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
                        {currentImage ? (
                            <img src={currentImage} alt="AI Render" className="render-img" />
                        ) : (
                            <div className="render-placeholder">
                                {initialImage && (
                                    <img src={initialImage} alt="Original" className="render-fallback" />
                                )}
                            </div>
                        )}
                        {isProcessing && (
                            <div className="render-overlay">
                                <div className="rendering-card">
                                    <RefreshCcw className="spinner" />
                                    <span className="title">Rendering...</span>
                                    <span className="subtitle">Generating your 3D visualization...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VisualiserId;