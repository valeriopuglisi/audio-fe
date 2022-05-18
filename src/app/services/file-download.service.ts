import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { DeepLearningAudioFeatures } from '../interfaces/deep-learning-audio-features';
import { PipelineStep } from '../interfaces/pipeline-step';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET heroes from the server */
  downloadFile(api:string, filename:string){
    return this.http.get<Blob>(api + "/"+ filename)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Blob>('downloadFile', null))
      );
  }

  
}
