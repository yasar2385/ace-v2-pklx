import { useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../services/http.services";
import { Loading } from "../components/loadingComponent";

export function Landing() {

  useEffect(() => {
    http.get('/api_select_all_courts.php')
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
  }, [])

  return (
    <main>
      <div
        id="myCarousel"
        className="carousel slide mb-6"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1693142518277-3568e9ec3176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="First slide"
              className="bd-placeholder-img w-100"
            />
            <div className="container">
              <div className="carousel-caption text-start">
                <h1>Create your group</h1>
                <p className="opacity-75">
                  Some representative placeholder content for the first slide of
                  the carousel.
                </p>
                <p>
                  <Link className="btn btn-lg btn-success" to={'/register'}>
                    Sign up today
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://images.unsplash.com/photo-1580763850522-504d40a05c50?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Second slide"
              className="bd-placeholder-img w-100"
            />
            <div className="container">
              <div className="carousel-caption">
                <h1>Pre-book your court</h1>
                <p>
                  Some representative placeholder content for the second slide
                  of the carousel.
                </p>
                <p>
                  <a className="btn btn-lg btn-success" href="#">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1693142517898-2f986215e412?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="third slide"
              className="bd-placeholder-img w-100"
            />
            <div className="container">
              <div className="carousel-caption text-end">
                <h1>Seasonal leagues</h1>
                <p>
                  Some representative placeholder content for the third slide of
                  this carousel.
                </p>
                <p>
                  <a className="btn btn-lg btn-success" href="#">
                    Browse Tournaments
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* <Loading /> */}
      <div className="container marketing">
        <div className="row">
          <div className="col-lg-4">

            <img src="https://img.freepik.com/free-vector/flat-design-padel-illustration_23-2149197786.jpg?w=826&t=st=1725376588~exp=1725377188~hmac=45aee19896c7472224dc38794d0bd461071613da70e78d339ebf1d97b84b7f50"
              alt="sda"
              className="bd-placeholder-img rounded-circle"
              width={140}
              height={140}
            />
            <h2 className="fw-normal">Club</h2>
            <p>
              It fosters a sense of community and camaraderie as players interact and compete regularly.
            </p>
            <p>
              <a className="btn btn-secondary" href="#">
                View details &raquo;
              </a>
            </p>
          </div>
          <div className="col-lg-4">
            <img src="https://img.freepik.com/free-vector/hand-drawn-people-playing-padel-illustration_23-2149189432.jpg?w=826&t=st=1725376709~exp=1725377309~hmac=f1e9f3b1e65529c2b79023ae32e7e60af98b6917a06f83a12064a4e0a37e899b"
              alt="sda"
              className="bd-placeholder-img rounded-circle"
              width={140}
              height={140}
            />
            <h2 className="fw-normal">Tournament</h2>
            <p>
              Players are motivated to play frequently to maintain or improve their ranking.
            </p>
            <p>
              <a className="btn btn-secondary" href="#">
                View details &raquo;
              </a>
            </p>
          </div>
          <div className="col-lg-4">
            <img
              src="https://images.unsplash.com/photo-1686721135029-3e3367daeab9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="sda"
              className="bd-placeholder-img rounded-circle"
              width={140}
              height={140}
            />
            <h2 className="fw-normal">Meet & Greet</h2>
            <p>
              The format encourages players to compete against opponents of varying skill levels, which helps in improving their game.
            </p>
            <p>
              <a className="btn btn-secondary" href="#">
                View details &raquo;
              </a>
            </p>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading fw-normal lh-1">
              What is ACE PICKL Shootout ladder?
            </h2>
            <p className="lead">
              A ACE PICKL Shootout Ladder League is a competitive format in which players or teams compete in a series of matches to climb a "ladder" ranking system. Here’s a breakdown of how it typically works
            </p>
          </div>
          <div className="col-md-5">
            <img src="https://images.unsplash.com/photo-1642104798671-01a4129f4fdc?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded-4"
              width={500}
              height={500}
            />
          </div>
        </div>

        <hr className="featurette-divider" />
      </div>
    </main>
  );
}