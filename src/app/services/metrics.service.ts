import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { DeepLearningAudioFeatures } from '../interfaces/deep-learning-audio-features';
@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  constructor(private http: HttpClient, private messageService: MessageService) { }
    
  public AudioFeatures: any = {}
  private deepLearningMetricsDictUrl = '/api/metrics';

  /** Log a MetricsService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MetricsService: ${message}`);
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

  /** GET Metricses from the server */
  getDeepLearningMetrics(): Observable<Object> {
    return this.http.get<Object>(this.deepLearningMetricsDictUrl)
      .pipe(
        tap(_ => this.log('fetched Metricses')),
        catchError(this.handleError<Object>('getDeepLearningMetricsDict', []))
      );
  }
}
