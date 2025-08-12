


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
        <Card.Text className="text-muted mb-3 flex-grow-1">
          {fullContent?.para}
        </Card.Text>
        
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
  const [expandedCards, setExpandedCards] = useState({})

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
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

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
      image: "https://img.freepik.com/free-vector/flat-design-padel-illustration_23-2149197786.jpg?w=826&t=st=1725376588~exp=1725377188~hmac=45aee19896c7472224dc38794d0bd461071613da70e78d339ebf1d97b84b7f50",
      fullContent: {
        para: "It fosters a sense of community and camaraderie as players interact and compete regularly. Take control of your club operations with comprehensive management tools.",
        intro: "With the Club Module, you can:",
        features: [
          "Manage member registrations and renewals",
          "Schedule training sessions and facilities", 
          "Track attendance and player progress",
          "Organize club events and social activities",
          "Handle financial transactions and dues"
        ],
        tagline: "Because every great club deserves great management tools."
      }
    },
    {
      title: "Tournament Module – Run Competitive Events with Ease",
      image: "https://img.freepik.com/free-vector/hand-drawn-people-playing-padel-illustration_23-2149189432.jpg?w=826&t=st=1725376709~exp=1725377309~hmac=f1e9f3b1e65529c2b79023ae32e7e60af98b6917a06f83a12064a4e0a37e899b",
      fullContent: {
        para: "Players are motivated to play frequently to maintain or improve their ranking. Organize professional-grade tournaments with powerful management tools.",
        intro: "With the Tournament Module, you can:",
        features: [
          "Create custom tournament formats and brackets",
          "Handle player registrations and seedings",
          "Manage live scoring and real-time updates", 
          "Generate comprehensive tournament reports",
          "Award prizes and track championship histories"
        ],
        tagline: "Because great tournaments create lasting memories."
      }
    },
    {
      title: "Meet & Greet – Find Your Match, Play Your Way",
      image: "https://images.unsplash.com/photo-1686721135029-3e3367daeab9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fullContent: {
        para: "The format encourages players to compete against opponents of varying skill levels, which helps in improving their game. Connect with the right partners for any type of match.",
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
                isExpanded={expandedCards[index] || false}
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