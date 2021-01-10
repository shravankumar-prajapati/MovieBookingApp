import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../movie';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  dataSaved = false;  
  movieForm: FormGroup;  
  allMovies: Movie[];  
  movieIdUpdate = null;  
  massage = null;  
  baseUrl:string;

  constructor(private formbulider: FormBuilder,private http: HttpClient, @Inject('BASE_URL') baseUrl: string,private datePipe: DatePipe) {
    this.baseUrl=baseUrl;
   }

  ngOnInit() {
    this.movieForm = this.formbulider.group({  
      Name: ['', [Validators.required]],  
      MoviesDescriptions: ['', [Validators.required]],  
      IsActive: ['', [Validators.required]],  
      ReleaseDate: ['', [Validators.required]],  
   });  
    this.loadAllMovies(); 
  }

  loadAllMovies() {  
  
    this.http.get<Movie[]>(this.baseUrl + 'api/Movie').subscribe(result => {
      this.allMovies = result;
     }, error => console.error(error));
 
  }  

  deleteMovie(movieId:number) {  
  
    this.http.delete<Movie[]>(this.baseUrl + 'api/Movie/'+movieId).subscribe(result => {
      this.movieIdUpdate =null;
      this.movieForm.reset();  
      this.loadAllMovies();
     }, error => console.error(error));
 
  }

  loadMovieToEdit(movieId:number)
  {
   
    this.http.get<Movie>(this.baseUrl + 'api/Movie/'+ movieId).subscribe(result => {
      this.movieIdUpdate = result.id;
      this.movieForm = this.formbulider.group({  
        Name: [result.name, [Validators.required]],  
        MoviesDescriptions: [result.moviesDescriptions, [Validators.required]],  
        IsActive: [result.isActive, [Validators.required]],  
        ReleaseDate: [this.datePipe.transform(result.releaseDate, 'yyyy-MM-dd'), [Validators.required]],
       
     }); 
     }, error => console.error(error));

  }
  onFormSubmit() {  
    this.dataSaved = false;  
    const movie = this.movieForm.value;  
    this.CreateMovie(movie);  
    this.movieForm.reset();  
  } 
  
  CreateMovie(movie: Movie) {  

   

    if (this.movieIdUpdate == null) {  
     
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
       return this.http.post<Movie>(this.baseUrl + 'api/Movie',  
      movie, httpOptions).subscribe(result => {
        this.dataSaved = true;  
        this.massage = 'Record saved Successfully';  
        this.loadAllMovies();  
        this.movieIdUpdate = null;  
        this.movieForm.reset();  
       }, error => console.error(error));

    } else {  
      movie.id = this.movieIdUpdate; 
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
      return this.http.put<Movie>(this.baseUrl + 'api/Movie/' + movie.id,  
      movie, httpOptions).subscribe(result => {
        this.dataSaved = true;  
        this.massage = 'Record updated Successfully';  
        this.loadAllMovies();  
        this.movieIdUpdate = null;  
        this.movieForm.reset();  
       }, error => console.error(error));
    }  
  }

}
