import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import '../pages/styles/UserInfoStep.css';
import FBXModelViewer from "./FBXModelViewer";
import "./HomeOrb.css";

// Products data array - exported for use in other components
export const products = [
  {
    id: 1,
    name: "PL-1050 CB",
    type: "Horizontal Single Bank Louver",
    image: "images/PL-1050 CB f.png",
    noiseReduction: "NA",
    rainDefence: "Fair",
    airflow: "Excellent",
    bladeSpacing: "50mm",
    systemDepth: "121mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 2,
    name: "PL-2050 CB",
    type: "Horizontal Double Bank Louver",
    image: "images/PL-2050(CB) f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Good",
    bladeSpacing: "50mm",
    systemDepth: "138mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 3,
    name: "PL-3050 CB",
    type: "Horizontal Triple Bank Louver",
    image: "images/PL-3050(CB) f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Fair",
    bladeSpacing: "50mm",
    systemDepth: "138mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 4,
    name: "PL-1075 CB",
    type: "Horizontal Single Bank Louver",
    image: "images/PL-1075(CB) f.png",
    noiseReduction: "NA",
    rainDefence: "Fair",
    airflow: "Excellent",
    bladeSpacing: "75mm",
    systemDepth: "127mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 5,
    name: "PL-2075 STB",
    type: "Horizontal Double Bank Louver",
    image: "images/PL-2075(STB)_1.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Good",
    bladeSpacing: "75mm",
    systemDepth: "144mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 6,
    name: "PL-3075 CB",
    type: "Horizontal Triple Bank Louver",
    image: "images/PL-3075(CB) f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Fair",
    bladeSpacing: "75mm",
    systemDepth: "144mm",
    category: "Horizontal",
    frame: "Hidden Mullion"
  },
  {
    id: 7,
    name: "PL-2150V",
    type: "Vertical Double Bank Louver",
    image: "images/PL-2150V f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Good",
    bladeSpacing: "50mm",
    systemDepth: "67mm",
    category: "Vertical",
    frame: "Visible Mullion"
  },
  {
    id: 8,
    name: "PL-2170",
    type: "Horizontal Double Bank Louver",
    image: "images/PL-2170f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Good",
    bladeSpacing: "70mm",
    systemDepth: "102mm",
    category: "Horizontal",
    frame: "Visible Mullion"
  },
  {
    id: 9,
    name: "PL-2250",
    type: "Horizontal Double Bank Louver",
    image: "images/PL-2250 f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Very Good",
    bladeSpacing: "50mm",
    systemDepth: "129mm",
    category: "Horizontal",
    frame: "Visible Mullion"
  },
  {
    id: 10,
    name: "PL-2065V",
    type: "Vertical Double Bank Louver",
    image: "images/PL-2065V_3D render (1).png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Very Good",
    bladeSpacing: "65mm",
    systemDepth: "144mm",
    category: "Vertical",
    frame: "Hidden Mullion"
  },
  {
    id: 11,
    name: "PL-2250V",
    type: "Vertical Double Bank Louver",
    image: "images/PL-2250 V f.png",
    noiseReduction: "NA",
    rainDefence: "Excellent",
    airflow: "Very Good",
    bladeSpacing: "50mm",
    systemDepth: "129mm",
    category: "Vertical",
    frame: "Visible Mullion"
  },
  {
    id: 12,
    name: "AC-150",
    type: "Acoustic Louver",
    image: "images/AC150f.png",
    noiseReduction: "Very Good",
    rainDefence: "Fair",
    airflow: "Fair",
    bladeSpacing: "250mm",
    systemDepth: "155mm",
    category: "Acoustic",
    frame: "Visible Mullion"
  },
  {
    id: 13,
    name: "AC-300",
    type: "Acoustic Louver",
    image: "images/AC300 f.png",
    noiseReduction: "Excellent",
    rainDefence: "Fair",
    airflow: "Fair",
    bladeSpacing: "300mm",
    systemDepth: "305mm",
    category: "Acoustic",
    frame: "Visible Mullion"
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeToggle, setActiveToggle] = useState(2); // Third toggle is active by default
  const [carouselIndex, setCarouselIndex] = useState(0);
  const videoRef = useRef(null);

  // Filter state
  const [filters, setFilters] = useState({
    category: null,
    frame: null,
    rainDefence: null,
    airflow: null
  });

  // Filter function
  const handleFilterChange = (filterType, value) => {
    /*console./* log('Before change:', filters);
    console.log('Clicking:', filterType, value);
    console.log('Current value:', filters[filterType]); */

    setFilters(prev => {
      const newValue = prev[filterType] === value ? null : value; // Toggle: if same value clicked, deselect it
      console.log('Setting to', newValue);
      return {
        ...prev,
        [filterType]: newValue
      };
    });
    // Scroll to products section after filtering
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      category: null,
      frame: null,
      rainDefence: null,
      airflow: null
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    return (
      (filters.category === null || product.category === filters.category) &&
      (filters.frame === null || product.frame === filters.frame) &&
      (filters.rainDefence === null || product.rainDefence === filters.rainDefence) &&
      (filters.airflow === null || product.airflow === filters.airflow)
    );
  });

  // Array of videos for each toggle
  const videos = [
    {
      src: "videos/Louver - Wind Test White Air w Leaves.mp4",
    },
    {
      src: "videos/Louver - Rain Pouring Long.mp4", 
    },
    {
      src: "videos/Louver - Sun Shinning Res 1920x1200 .mp4",
    },
    {
      src: "videos/Louver - Accoustic .mp4",
    }
  ];

  const handleFindLouverClick = () => {
    navigate("/luva-start");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleToggleClick = (index) => {
    setActiveToggle(index);
    // Update video source and reload
    if (videoRef.current) {
      videoRef.current.src = videos[index].src;
      videoRef.current.load(); // Load the new video
      videoRef.current.play(); // Start playing the new video
    }
  };

  const handleCarouselNav = (direction) => {
    setCarouselIndex((prev) => (prev + direction + totalProjects) % totalProjects);
  };

  const handleDotClick = (idx) => {
    setCarouselIndex(idx);
  };

  const projectDetails = [
    {
      location: "Jakarta, Indonesia", 
      name: "JKT02 House", 
      description: "Installation of PL-2250 and PL-2250V double bank louvers for rain defense and airflow control in data centre.",
      product: "PL-2250",
      product_description: "Double Bank Louver with Visible Mullion",
      client_header: "Client/Company",
      client: "EdgeConneX Inc."
    },
    {
      location: "Jakarta, Indonesia",
      name: "Equinix Data Centre",
      description: "High rain defence louvers and good airflow to provide sufficient ventilation for data systems. Horizontal aesthetic for a seamless hidden mullion design.",
      product: "PL-2050",
      product_description: "Horizontal Double Bank Louver with Hidden Mullion",
      client_header: "Client/Company",
      client: "Equinix Inc."
    },
    {
      location: "Singapore",
      name: "T302 Founders' Memorial MRT Station",
      description: "PL-2075 used for an excellent balance between rain defence and airflow against exposure to coastal weather conditions. AC-300 Acoustic Louver installed for noise reduction from nearby cooling tower equipment.",
      product: "PL-2075, AC-300",
      product_description: "Horizontal Double Bank Louver, Acoustic Louver",
      client_header: "Client/Company",
      client: "Land Transport Authority, Singapore"
    },
    {
      location: "Singapore",
      name: "Pasir Ris Mall",
      description: "High-performance horizontal single bank louvers, reinforced by doubly-banked louvers for good balance of rain defence and airflow for residential areas.",
      product: "PL-1075, PL-2075",
      product_description: "Horizontal Bank Louvers with Hidden Mullion",
      client_header: "Client/Company",
      client: "Allgreen Properties Pte. Ltd."
    },
    {
      location: "Kuala Lumpur, Malaysia",
      name: "Sunway Warehouse",
      description: "PL-2150V vertical double bank louvers used for rain defence for warehouse storage protection. Sufficient airflow to fulfill fire safety requirements, ensuring cost effectiveness.",
      product: "PL-2150V",
      product_description: "Vertical Double Bank Louver",
      client_header: "Client/Company",
      client: "Sunway Group Pte. Ltd."
    }
  ];
  const totalProjects = projectDetails.length;

  return (
    <div className="gradient-bg">
            {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={scrollToTop}>
          <img
            src="images/Logo (1).png"
            alt="Logo"
          />
        </div>
        <div className="nav-links">
          <button onClick={() => scrollToSection("about")} className="nav-link">
            About
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="nav-link"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection("reviews")}
            className="nav-link"
          >
            Reviews
          </button>
          <button
            onClick={() => scrollToSection("cta")}
            className="nav-link"
          >
            Contact
          </button>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <h1 className="performance-title">Performance Louvers.</h1>
          <h2 className="beautiful-facade">More than a beautiful facade.</h2>
          <p className="hero-description">
            Our efficient performer louvers can improve airflow to building
            systems while protecting them against rain and resolve noise
            propagation.
          </p>
          <button className="find-louver-btn" onClick={handleFindLouverClick}>
            Find your louver
          </button>
        </div>
        <div className="hero-image">
            <FBXModelViewer url="images/PL-3075(STB)_max panel size v3.fbx" pivot={[0, 0, 0] }
            alt="Performance Louver"/>
        </div>
      </section>

      {/* Why Performance Louvers Section */}
      <section className="why-performance-section" id="why-performance">
        
        <div className="louver-showcase">
          <video autoPlay loop playsInline className="louver-video" ref={videoRef}>
            <source src={videos[activeToggle].src} type="video/mp4"/>
            Your browser does not support this video tag.
          </video>
          <div className="section-title">
            Why <span className="highlight-green">Performance Louvers</span>?
            <p className="section-description">
              Performance louvers serve multiple functions: regulating ventilation,
              preventing rain ingress, controlling natural light, and managing
              acoustic levels.
            </p>
          </div>
  
        {/* Toggle Controls */}
          <div className="toggle-controls">
            <div
              className={`toggle-item ${activeToggle === 0 ? "active" : ""}`}
              onClick={() => handleToggleClick(0)}
            >
              <div className="toggle-circle">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/da4e09a8e0ee189e969d9eaf6faf0bbb379d841f?width=256"
                  alt="Icon 1"
                />
              </div>
            </div>
            <div
              className={`toggle-item ${activeToggle === 1 ? "active" : ""}`}
              onClick={() => handleToggleClick(1)}
            >
              <div className="toggle-circle">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/231ee1d424f2f8e16b5b03a1d2c51f694b2f1686?width=180"
                  alt="Icon 2"
                />
              </div>
            </div>
            <div
              className={`toggle-item ${activeToggle === 2 ? "active" : ""}`}
              onClick={() => handleToggleClick(2)}
            >
              <div className="toggle-circle">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c56743208f56be9a50f75d9e48c552e11dfceaee?width=190"
                  alt="Icon 3"
                />
              </div>
            </div>
            <div
              className={`toggle-item ${activeToggle === 3 ? "active" : ""}`}
              onClick={() => handleToggleClick(3)}
            >
              <div className="toggle-circle">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c5b8ae4c0ea646044cebf50621e18c3cfe5ea9a?width=218"
                  alt="Icon 4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Luva Section */}
      <section className="about-luva-section" id="about">
        <div className="about-content">
          <h2 className="about-title">
            About <span className="highlight-green">Luva</span>
          </h2>
          <p className="about-description">
            The challenge lies in specification. Each project demands a unique
            balance influenced by factors ranging from local climate conditions
            to specific building requirements.
            <br />
            <br />
            Our AI-powered optimization engine,{" "}
            <span className="highlight-green">Luva</span> simplifies this
            complex specification process. By analyzing your project parameters
            and aesthetic preferences,{" "}
            <span className="highlight-green">Luva</span> computes the best
            louver configuration for you from our comprehensive product range.
            This AI-driven approach ensures architects receive precise,
            performance-validated recommendations tailored to their specific
            application.
          </p>
        </div>
        {/* Orb side with correct structure */}
            <div className="home-orb-container">
              <div className="home-orb">
                <div className="home-orb-pulse"></div>
                <div className="home-orb-ping"></div>
                <div className="home-orb-highlight"></div>
                <div className="home-orb-glow"></div>
                <div className="home-lava"></div>
              </div>
            </div>
      </section>

      {/* Our Performance Louvers Section */}
      <section className="our-louvers-section" id="products">
        <div className="section-header">
          <h2 className="section-title">
            Our <span className="highlight-green">Performance Louvers</span>
          </h2>
          <button className="filter-button" onClick={toggleFilter}>
            <div className="filter-line"></div>
            <div className="filter-line"></div>
            <div className="filter-line"></div>
          </button>
        </div>

        {/* Filter Popup */}
        {isFilterOpen && (
          <div className="filter-popup">
            <div className="filter-content">
              <div className="filter-header">
                <h3>Select filters:</h3>
                <button className="filter-close" onClick={toggleFilter}>
                  <div className="filter-line"></div>
                  <div className="filter-line"></div>
                  <div className="filter-line"></div>
                </button>
              </div>

              <div className="filter-section">
                <h4>Category</h4>
                <label 
                  className={`filter-option ${filters.category === "Horizontal" ? "active" : ""}`}
                  onClick={() => handleFilterChange("category", "Horizontal")}
                >
                  <div className="radio-circle"></div>
                  <span>Horizontal</span>
                </label>
                <label 
                  className={`filter-option ${filters.category === "Vertical" ? "active" : ""}`}
                  onClick={() => handleFilterChange("category", "Vertical")}
                >
                  <div className="radio-circle"></div>
                  <span>Vertical</span>
                </label>
                <label 
                  className={`filter-option ${filters.category === "Acoustic" ? "active" : ""}`}
                  onClick={() => handleFilterChange("category", "Acoustic")}
                >
                  <div className="radio-circle"></div>
                  <span>Acoustic</span>
                </label>
              </div>
              <div className="filter-section">
                <h4>Frame</h4>
                <label 
                  className={`filter-option ${filters.frame === "Hidden Mullion" ? "active" : ""}`}
                  onClick={() => handleFilterChange("frame", "Hidden Mullion")}
                >
                  <div className="radio-circle"></div>
                  <span>Hidden Mullion</span>
                </label>
                <label 
                  className={`filter-option ${filters.frame === "Visible Mullion" ? "active" : ""}`}
                  onClick={() => handleFilterChange("frame", "Visible Mullion")}
                >
                  <div className="radio-circle"></div>
                  <span>Visible Mullion</span>
                </label>
              </div>

              <div className="filter-section">
                <h4>Rain Defence</h4>
                <label 
                  className={`filter-option ${filters.rainDefence === "Fair" ? "active" : ""}`}
                  onClick={() => handleFilterChange("rainDefence", "Fair")}
                >
                  <div className="radio-circle"></div>
                  <span>Fair</span>
                </label>
                <label 
                  className={`filter-option ${filters.rainDefence === "Good" ? "active" : ""}`}
                  onClick={() => handleFilterChange("rainDefence", "Good")}
                >
                  <div className="radio-circle"></div>
                  <span>Good</span>
                </label>
                <label 
                  className={`filter-option ${filters.rainDefence === "Excellent" ? "active" : ""}`}
                  onClick={() => handleFilterChange("rainDefence", "Excellent")}
                >
                  <div className="radio-circle"></div>
                  <span>Excellent</span>
                </label>
              </div>

              <div className="filter-section">
                <h4>Airflow</h4>
                <label 
                  className={`filter-option ${filters.airflow === "Fair" ? "active" : ""}`}
                  onClick={() => handleFilterChange("airflow", "Fair")}
                >
                  <div className="radio-circle"></div>
                  <span>Fair</span>
                </label>
                <label 
                  className={`filter-option ${filters.airflow === "Good" ? "active" : ""}`}
                  onClick={() => handleFilterChange("airflow", "Good")}
                >
                  <div className="radio-circle"></div>
                  <span>Good</span>
                </label>
                <label 
                  className={`filter-option ${filters.airflow === "Very Good" ? "active" : ""}`}
                  onClick={() => handleFilterChange("airflow", "Very Good")}
                >
                  <div className="radio-circle"></div>
                  <span>Very Good</span>
                </label>
                <label 
                  className={`filter-option ${filters.airflow === "Excellent" ? "active" : ""}`}
                  onClick={() => handleFilterChange("airflow", "Excellent")}
                >
                  <div className="radio-circle"></div>
                  <span>Excellent</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <div className='photo'>
                <img src={product.image} alt={product.name} />
              </div>
              <div className='content'>
                <div className='trait'>
                  <div className='traits'>
                    <h3>Noise Reduction:</h3>
                    <div className='rating'>{product.noiseReduction}</div>
                    </div>  
                  <div className='traits'>
                    <h3>Rain Defence:</h3>
                    <div className='rating'>{product.rainDefence}</div>
                  </div>
                  <div className='traits'>
                    <h3>Airflow:</h3>
                    <div className='rating'>{product.airflow}</div>
                  </div>
                  <div className='traits'>
                    <h3>Blade Spacing:</h3>
                    <div className='rating'>{product.bladeSpacing}</div>
                  </div>
                  <div className='traits'>
                    <h3>System Depth:</h3>
                    <div className='rating'>{product.systemDepth}</div>
                  </div>
                </div>
                <h1 className='title'>{product.name}</h1>
                <div className='type'>
                  <h3>{product.type}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="recent-projects-section" id="reviews">
        <h2 className="section-title">
          Explore <span className="highlight-green">Performance Louvers</span>
          <br />
          in Recent Projects
        </h2>

        <div className="project-container">
          <button className="nav-arrow left" onClick={() => handleCarouselNav(-1)}>‹</button>
          <div className="carousel-track">
            {projectDetails.map((project, i) => {
              let className = "card";
              const offset = (i - carouselIndex + totalProjects) % totalProjects;
              if (offset === 0) className += " center";
              else if (offset === 1) className += " right-1";
              else if (offset === 2) className += " right-2";
              else if (offset === totalProjects - 1) className += " left-1";
              else if (offset === totalProjects - 2) className += " left-2";
              return (
                <div
                  className={className}
                  key={i}
                  data-index={i}
                  onClick={() => setCarouselIndex(i)}
                >
                  <img
                    src={`images/${['10.jpg','NCC Link Bridge 7.JPG','Plexus Roof Cooling Tower Single Bank Louver 1.jpg','PR8 11.jpg','Lak Si Skywalk 1a.jpg'][i] }?width=1468`}
                    alt={project.name}
                  />
                </div>
              );
            })}
            <button className="nav-arrow right" onClick={() => handleCarouselNav(1)}>›</button>
          </div>
          <div className="dots">
            {projectDetails.map((_, i) => (
              <div
                key={i}
                className={`dot${i === carouselIndex ? " active" : ""}`}
                data-index={i}
                onClick={() => handleDotClick(i)}
              ></div>
            ))}
          </div>
          <div className="project-info">
            <div className="project-details">
              <div className="location">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac84a0f21581a5f03abc37f57aed21260c464b8b?width=66"
                  alt="Location Icon"
                />
                <span>{projectDetails[carouselIndex].location}</span>
              </div>
              <h3>{projectDetails[carouselIndex].name}</h3>
              <br />
              <p>{projectDetails[carouselIndex].description}</p>
            </div>
            <div className="product-highlight">
              <h4 className="product-name">{projectDetails[carouselIndex].product}</h4>
              <p className="product-type">{projectDetails[carouselIndex].product_description}</p>
              <hr className="divider" />
              <div className="client-info">
                <strong>{projectDetails[carouselIndex].client_header}</strong>
                <span>{projectDetails[carouselIndex].client}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section" id="cta">
        <h2 className="cta-title">
          Ready to find your{" "}
          <span className="highlight-green">Performance Louver</span>?
        </h2>
        <button
          className="find-louver-btn cta-btn"
          onClick={handleFindLouverClick}
        >
          Find your louver
        </button>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-logo">
            <img
              src="images/Logo (1).png"
              alt="Fameline Logo"
            />
          </div>
          <div className="footer-contact">
            <p>Get in touch with us.</p>
            <div className="social-links">
              <a href="https://wa.me/6588663558" target="_blank">
              <img
                src="images/md_5b321c98efaa6.jpg"
                alt="Social 1"
              /></a>
              <a href="https://www.facebook.com/share/1ApBBshqF1/" target="_blank">
              <img
                src="images/Facebook_logo_(square).png"
                alt="Social 2"
              /></a>
              <a href="mailto:enquiry@fameline-apsg.com" target="_blank">
              <img
                src="images/печать-201003176.png"
                alt="Social 3"
              /></a>
              <a href="https://www.linkedin.com/company/fameline-apsg/" target="_blank">
              <img
                src="images/LinkedIn_icon.svg.png"
                alt="Social 4"
              /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2025 Fameline APSG Pte Ltd</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
