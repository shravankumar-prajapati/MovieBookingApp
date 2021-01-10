using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MovieBooking.DB;
using MovieBooking.Service;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MovieBooking.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {

        public readonly IMovieRepo _movieRepo;

        public MovieController(IMovieRepo movieRepo)
        {
            _movieRepo = movieRepo;
        }

        // GET: api/<MovieController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
           var movie=  _movieRepo.GetMovies();
            return movie;
        }

        // GET api/<MovieController>/5
        [HttpGet("{id}")]
        public Movie Get(int id)
        {
            var movie = _movieRepo.GetMovieById(id);
            return movie;
        }

        // POST api/<MovieController>
        [HttpPost]
        public void Post([FromBody] Movie movie)
        {
            movie.CreatedDate = DateTime.Now;
            movie.UpdatedDate = DateTime.Now;
            movie.UpdatedBy = "Added";
            _movieRepo.CreateMovie(movie);
          
        }

        // PUT api/<MovieController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Movie movie)
        {
           
            movie.UpdatedDate = DateTime.Now;
            movie.UpdatedBy = "Updated";
            _movieRepo.UpdateMovie(id,movie);
        }

        // DELETE api/<MovieController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _movieRepo.DeleteMovie(id);
        }
    }
}
