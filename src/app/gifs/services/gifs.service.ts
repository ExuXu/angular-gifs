import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import { timeout } from 'rxjs';

const GIFHY_API_KEY = '9toyGLh2zjLelyYtRP2OLBmb5xjvj5in'

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory( tag: string ) {
    if (tag.length === 0) return;

    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);

  }

  searchTag( tag: string): void {
    this.organizeHistory( tag )

    const params = new HttpParams()
      .set('api_key', GIFHY_API_KEY )
      .set('q', tag )
      .set('limit', '10')

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params: params })
      .subscribe( resp => {
        this.gifsList = resp.data;
      })

  }

}
