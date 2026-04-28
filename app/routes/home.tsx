import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";
import { useState } from "react";
import { createProject } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [project, setProject] = useState<DesignItem[]>([]);
  const handleUploadComplete = async (base64Image: string) => {
    const newId = Date.now().toString();

    const name = `Residence ${newId}`;

    const newItem = {
      id: newId,
      name,
      sourceImage: base64Image,
      renderImage: undefined,
      timestamp: Date.now(),
    };

    const saved = await createProject({ item: newItem, visibility: "private" });

    if (!saved) {
      console.error("Failed to create project");
      return false;
    }

    setProject((prev) => [newItem, ...prev]);

    navigate(`visualiser/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        initialRender: saved.renderedImage || null,
        name,
      },
    });
    return true;
  };

  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="announce">
            <div className="dot">
              <div className="pulse" />
            </div>
            <p>Introducing Structify 2.0</p>
          </div>

          <h1>Build beautiful space at the speed of thought with Structify</h1>

          <p className="subtitle">
            Structify is an AI first design environment that helps you
            visualize, render, and ship architectural projects faster than ever.
          </p>

          <div className="actions">
            <a href="/upload" className="cta">
              Start Building <ArrowRight className="icon" />
            </a>
            <Button size="lg" className="demo" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan.</h3>
              <p>Supports JPG, PNG formats up to 10 MB</p>
            </div>
            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>
                Your latest work and shared community projects all in one place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {project.map(({id, name, renderedImage, sourceImage, timestamp}) => (
              <div className="project-card group">
                <div className="preview">
                  <img
                    src={renderedImage || sourceImage}
                    alt="blueprint"
                  />
                  <div className="badge">
                    <span>Community</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-info">
                    <h3>{name}</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By AR</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight className="icon" size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
