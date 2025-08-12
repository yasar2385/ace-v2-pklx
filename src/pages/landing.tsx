


import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap'
import { ChevronDown, ChevronUp } from 'lucide-react'

import http from "../services/http.services";

// CategoryCard component using React Bootstrap
const CategoryCard = ({ title, image, fullContent, cardId, isExpanded, onToggle }) => {
  return (
    <Card className="h-100 shadow-sm border-0" style={{ transition: 'all 0.3s ease' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={image}
          alt={title}
          style={{
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5 fw-bold mb-3">{title}</Card.Title>
        <Card.Text
          className="text-muted mb-3 flex-grow-1"
          dangerouslySetInnerHTML={{ __html: fullContent?.para }}
        />

        {isExpanded && fullContent && (
          <div className="mt-3 pt-3 border-top">
            {fullContent.intro && (
              <>
                <p className="fw-medium mb-2 text-dark">{fullContent.intro}</p>
                <ul className="list-unstyled ms-3">
                  {fullContent.features?.map((feature, index) => (
                    <li key={index} className="mb-1">
                      <small>• {feature}</small>
                    </li>
                  ))}
                </ul>
                {fullContent.tagline && (
                  <p className="mt-3 fw-bold text-success small">{fullContent.tagline}</p>
                )}
              </>
            )}
          </div>
        )}

        <Button
          variant={isExpanded ? "outline-success" : "success"}
          className="mt-auto w-100"
          onClick={() => onToggle(cardId)}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ms-2" size={16} />
            </>
          ) : (
            <>
              View Details <ChevronDown className="ms-2" size={16} />
            </>
          )}
        </Button>
      </Card.Body>
    </Card>
  )
}

// Main Landing Component
export function Landing() {
  const [expandedCard, setExpandedCard] = useState(null);


  useEffect(() => {
    // Simulating the HTTP call - replace with your actual service
    const fetchData = async () => {
      try {
        // http.get('/api_select_all_courts.php')
        console.log('API call would happen here')
      } catch (error) {
        console.error('There was an error!', error)
      }
    }

    fetchData()
  }, [])

  const toggleCard = (cardId) => {
    setExpandedCard(prevId => (prevId === cardId ? null : cardId));
  };

  const carouselItems = [
    {
      image: "https://images.unsplash.com/photo-1693142518277-3568e9ec3176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Create your group",
      description: "Some representative placeholder content for the first slide of the carousel.",
      buttonText: "Sign up today",
      buttonLink: "/register",
      captionClass: "text-start"
    },
    {
      image: "https://images.unsplash.com/photo-1580763850522-504d40a05c50?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pre-book your court",
      description: "Some representative placeholder content for the second slide of the carousel.",
      buttonText: "Learn more",
      buttonLink: "#",
      captionClass: "text-center"
    },
    {
      image: "https://images.unsplash.com/photo-1693142517898-2f986215e412?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Seasonal leagues",
      description: "Some representative placeholder content for the third slide of this carousel.",
      buttonText: "Browse Tournaments",
      buttonLink: "#",
      captionClass: "text-end"
    }
  ]

  const categories = [
    {
      title: "Club Module – Run Your Club, Your Way",
      image: "/club.png",
      fullContent: {
        para: "Managing a pickleball club has never been easier. The PKLX Club Module empowers organizers with everything they need—whether you're coordinating casual play or hosting competitive formats. From seamless player communication and real-time notifications to setting up Round Robins, Ladder Leagues, and Tournaments, our tools are built to save time and build community.",
        intro: "With the Club Module, you can:",
        features: [
          "Organize matches in multiple formats (Round Robin, Knockout, Ladder, etc.)",
          "Notify players instantly about game updates",
          "Track attendance, performance, and rankings",
          "Create recurring or one-off events effortlessly",
          "Strengthen your club culture with better engagement"
        ],
        tagline: "We made it easy so you can focus on what matters—playing more, managing less."
      }
    },
    {
      title: "Tournament Module – Run Competitive Events with Ease",
      image: "/tournament.png",
      fullContent: {
        para: "Whether you're hosting a local showdown or a multi-day tournament, the PKLX Tournament Module gives you the power to manage it all with just a few taps. Designed for organizers who want flexibility and players who crave fair, exciting matchups, this module supports multiple formats including Single Elimination, Double Elimination, Round Robin, and Round Robin + Knockout. <br> With intuitive controls and real-time updates, organizers can focus on the action—not the admin. From registration to results, PKLX makes every step smooth, accurate, and professional.",
        intro: "With the Tournament Module, you can:",
        features: [
          "Host tournaments in various formats (Single/Double Elimination, Round Robin, Knockout)",
          "Auto-generate brackets and match schedules",
          "Track scores, rankings, and player stats live",
          "Notify participants instantly with updates and results",
          "Streamline check-ins and reduce no-shows with smart tools",
          "Elevate the player experience with clean design and smooth navigation"
        ],
        tagline: "PKLX Tournament Module—because every match should feel like a final."
      }
    },
    {
      title: "Meet & Greet – Find Your Match, Play Your Way",
      image: "/meet.png",
      fullContent: {
        para: "Whether you're in it for fun or fierce competition, our Meet & Greet module helps you find players at your skill level for the kind of games you love. From friendly rallies to high-intensity matches, PKLX makes it easy to connect with the right partners.",
        intro: "With Meet & Greet, you can:",
        features: [
          "Discover players near you who match your level",
          "Set up friendly or competitive games with ease",
          "Track performance and build your player profile",
          "Earn rewards and grow your local network"
        ],
        tagline: "Because great games start with the right matchup."
      }
    }
  ]

  return (
    <main>
      {/* Hero Carousel */}
      <Carousel className="mb-5" interval={5000}>
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.image}
              alt={item.title}
              style={{
                height: '500px',
                objectFit: 'cover',
                filter: 'brightness(0.7)'
              }}
            />
            <Carousel.Caption className={item.captionClass}>
              <Container>
                <div style={{ maxWidth: '500px', margin: item.captionClass === 'text-center' ? '0 auto' : item.captionClass === 'text-end' ? '0 0 0 auto' : '0 auto 0 0' }}>
                  <h1 className="display-4 fw-bold">{item.title}</h1>
                  <p className="lead opacity-75 mb-4">{item.description}</p>
                  <Button
                    variant="success"
                    size="lg"
                    href={item.buttonLink}
                    className="px-4 py-2"
                  >
                    {item.buttonText}
                  </Button>
                </div>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Category Cards Section */}
      <Container className="my-5">
        <Row className="g-4">
          {categories.map((category, index) => (
            <Col key={index} lg={4} md={6}>
              <CategoryCard
                {...category}
                cardId={index}
                isExpanded={expandedCard === index}
                onToggle={toggleCard}
              />
            </Col>
          ))}
        </Row>

        <hr className="my-5" />

        {/* Feature Section */}
        <Row className="align-items-center">
          <Col md={7}>
            <h2 className="display-5 fw-normal lh-1 mb-3">
              What is ACE PICKL Shootout ladder?
            </h2>
            <p className="lead">
              A ACE PICKL Shootout Ladder League is a competitive format in which players or teams compete in a series of matches to climb a "ladder" ranking system. Here's a breakdown of how it typically works
            </p>
          </Col>
          <Col md={5}>
            <img
              src="https://images.unsplash.com/photo-1642104798671-01a4129f4fdc?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="ACE PICKL Shootout"
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>
    </main>
  )
}