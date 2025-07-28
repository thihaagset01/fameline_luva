import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import FBXModelViewer from "./FBXModelViewer";

const HomePage = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeToggle, setActiveToggle] = useState(2); // Third toggle is active by default
  const [carouselIndex, setCarouselIndex] = useState(0);

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
    <div className="hero-page">
      {/* Background Effects */}
      <div className="background-effects">
        <svg
          className="green-blur"
          width="861"
          height="835"
          viewBox="0 0 1261 1235"
          fill="none"
        >
          <g opacity="0.6" filter="url(#filter0_f_246_73)">
            <ellipse
              cx="630.5"
              cy="617.5"
              rx="430.5"
              ry="417.5"
              fill="#8CE88E"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_246_73"
              x="0"
              y="0"
              width="1261"
              height="1235"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_246_73"
              />
            </filter>
          </defs>
        </svg>

        <svg
          className="yellow-gradient"
          width="2073"
          height="1564"
          viewBox="0 0 2073 1564"
          fill="none"
        >
          <g filter="url(#filter0_f_191_328)">
            <path
              d="M105.343 105.671L1967.77 447.562L1430.24 1458.51L105.343 105.671Z"
              fill="url(#paint0_linear_191_328)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_191_328"
              x="0.343201"
              y="0.670654"
              width="2072.43"
              height="1562.84"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="52.5"
                result="effect1_foregroundBlur_191_328"
              />
            </filter>
            <linearGradient
              id="paint0_linear_191_328"
              x1="105.343"
              y1="105.671"
              x2="2230.23"
              y2="1235.49"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FAFFA4" />
              <stop offset="1" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="gold-blur"
          width="1405"
          height="1352"
          viewBox="0 0 1405 1352"
          fill="none"
        >
          <g filter="url(#filter0_f_188_740)">
            <ellipse
              cx="702.185"
              cy="676.438"
              rx="514.413"
              ry="461.729"
              transform="rotate(-30 702.185 676.438)"
              fill="url(#paint0_linear_188_740)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_188_740"
              x="0.319946"
              y="0.932129"
              width="1403.73"
              height="1351.01"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_188_740"
              />
            </filter>
            <linearGradient
              id="paint0_linear_188_740"
              x1="702.185"
              y1="214.708"
              x2="702.185"
              y2="1138.17"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C3C67F" />
              <stop offset="0.879808" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="dark-blur"
          width="1019"
          height="1036"
          viewBox="0 0 1019 1036"
          fill="none"
        >
          <g opacity="0.6" filter="url(#filter0_f_146_59)">
            <ellipse cx="509.5" cy="518" rx="309.5" ry="318" fill="#111111" />
          </g>
          <defs>
            <filter
              id="filter0_f_146_59"
              x="0"
              y="0"
              width="1019"
              height="1036"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_146_59"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={scrollToTop}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/691b4ce4126b21a2b826b1369a540af253ae50a2?width=1107"
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
            onClick={() => scrollToSection("contact")}
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
        <h2 className="section-title">
          Why <span className="highlight-green">Performance Louvers</span>?
        </h2>
        <p className="section-description">
          Performance louvers serve multiple functions: regulating ventilation,
          preventing rain ingress, controlling natural light, and managing
          acoustic levels.
        </p>

        <div className="louver-showcase">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/69eb2619c35c7dfe7010afe7b49e58129aa59e0d?width=918"
            alt="Louver Showcase"
          />
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
        <div className="about-image">
          <img
            src=""
            alt="Luva AI System"
          />
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
                <h4>Bank</h4>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Single</span>
                </label>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Double</span>
                </label>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Triple</span>
                </label>
              </div>

              <div className="filter-section">
                <h4>Orientation</h4>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Horizontal</span>
                </label>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Vertical</span>
                </label>
              </div>

              <div className="filter-section">
                <h4>Frame</h4>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Hidden Mullion</span>
                </label>
                <label className="filter-option">
                  <div className="radio-circle"></div>
                  <span>Visible Mullion</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="product-grid">
          <div className="product-card">
            <div className='photo'><img
              src="images/PL-1050 CB f.png"
              alt="PL-1050 CB"
            /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Fair</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Excellent </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 121mm </div>
                </div>
              </div>
              <h1 className='title'>PL-1050 CB</h1>
                <div className='type'>
                  <h3> Horizontal Single Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'><img
              src="images/PL-2050(CB) f.png"
              alt="PL-2050(CB)"
            /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 138mm </div>
                </div>
              </div>
              <h1 className='title'>PL-2050 CB</h1>
                <div className='type'>
                  <h3> Horizontal Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'><img
              src="images/PL-3050(CB) f.png"
              alt="PL-3050"
            /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Fair </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 138mm </div>
                </div>
              </div>
              <h1 className='title'>PL-3050 CB</h1>
                <div className='type'>
                  <h3> Horizontal Triple Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'>
              <img
              src="images/PL-1075(CB) f.png"
              alt="PL-1075(CB)"
            />
            </div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Fair</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Excellent </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 75mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 127mm </div>
                </div>
              </div>
              <h1 className='title'>PL-1075 CB</h1>
                <div className='type'>
                  <h3> Horizontal Single Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'><img
              src="images/PL-2075(STB)_1.png"
              alt="PL-2075(STB)"
            /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 75mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 144mm </div>
                </div>
              </div>
              <h1 className='title'>PL-2075 STB</h1>
                <div className='type'>
                  <h3> Horizontal Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'>
              <img
                src="images/PL-3075(CB) f.png"
                alt="PL-3075(CB)"/>
            </div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Fair </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 75mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 144mm </div>
                </div>
              </div>
              <h1 className='title'> PL-3075 CB</h1>
                <div className='type'>
                  <h3> Horizontal Triple Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/PL-2170f.png"
                alt="PL-2150V"
              />
            </div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 70mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 102mm </div>
                </div>
              </div>
              <h1 className='title'> PL-2170 CB</h1>
                <div className='type'>
                  <h3> Horizontal Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/PL-2250 f.png"
                alt="PL-2170f"
              />
            </div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Very Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 129mm </div>
                </div>
              </div>
              <h1 className='title'> PL-2250 CB</h1>
                <div className='type'>
                  <h3> Horizontal Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/PL-2065V_3D render.png"
                alt="PL-2065V"
              />
            </div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Very Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 65mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 144mm </div>
                </div>
              </div>
              <h1 className='title'> PL-2065V </h1>
                <div className='type'>
                  <h3> Vertical Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/PL-2150V f.png"
                alt="PL-2150V"
              /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 67mm </div>
                </div>
              </div>
              <h1 className='title'> PL-2150V </h1>
                <div className='type'>
                  <h3> Vertical Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className='photo'>
              <img
                src="images/PL-2250 V f.png"
                alt="PL-2250 V"
              /></div>
            <div className='content'>
              <div className='trait'>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Very Good </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 50mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 129mm </div>
                </div>
              </div>
              <h1 className='title'> PL-2250V </h1>
                <div className='type'>
                  <h3> Vertical Double Bank Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/AC150f.png"
                alt="AC-150"
              />
            </div>
            <div className='content'>
              <div className='acoustic-trait'>
                <div className='traits'>
                  <h3> Noise Reduction: </h3>
                  <div className='rating'> Very Good</div>
                </div>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Fair</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Fair </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 250mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 155mm </div>
                </div>
              </div>
              <h1 className='title'> AC-150 </h1>
                <div className='type'>
                  <h3> Acoustic Louver </h3>
                </div>
            </div>
          </div>
          <div className="product-card">
            <div className="photo">
              <img
                src="images/AC300 f.png"
                alt="AC-300"
              />
            </div>
            <div className='content'>
              <div className='acoustic-trait'>
                <div className='traits'>
                  <h3> Noise Reduction: </h3>
                  <div className='rating'> Excellent</div>
                </div>
                <div className='traits'>
                  <h3> Rain Defence: </h3>
                  <div className='rating'>Fair</div>
                </div>
                <div className='traits'>
                  <h3> Airflow: </h3>
                  <div className='rating'> Fair </div>
                </div>
                <div className='traits'>
                  <h3> Blade Spacing: </h3>
                  <div className='rating'> 300mm </div>
                </div>
                <div className='traits'>
                  <h3> System Depth: </h3>
                  <div className='rating'> 305mm </div>
                </div>
              </div>
              <h1 className='title'> AC-300 </h1>
                <div className='type'>
                  <h3> Acoustic Louver </h3>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="recent-projects-section" id="reviews">
        <h2 className="section-title">
          Explore <span className="highlight-green">Performance Louvers</span>
          <br />
          < br />
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
      <section className="cta-section">
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
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/691b4ce4126b21a2b826b1369a540af253ae50a2?width=1107"
              alt="Fameline Logo"
            />
          </div>
          <div className="footer-contact">
            <p>Get in touch with us.</p>
            <div className="social-links">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/874780fdae3873b40bcc1852318ed6320cdb6977?width=160"
                alt="Social 1"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c416fc71842302268e4f771e6184ea6c18d6bc5?width=164"
                alt="Social 2"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/64a733384a11b736f1e1dc906559f454d5989d2b?width=154"
                alt="Social 3"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e22febd130ff1084bc82dd56244a6e1607893aa1?width=163"
                alt="Social 4"
              />
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
