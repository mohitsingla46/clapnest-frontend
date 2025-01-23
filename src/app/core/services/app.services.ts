import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { catchError, map, Observable, of } from "rxjs";
import { GET_CHAT_HISTORY, GET_USER_DETAIL, GET_CHAT_USERS, GET_CHATS, GET_PROFILE, LOGIN_MUTATION, SIGNUP_MUTATION } from "src/app/graphql/graphql-queries";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  http = inject(HttpClient);
  apollo = inject(Apollo);

  signup(user: { name: string, email: string, password: string }): Observable<any> {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: user,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
  }

  chatusers(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CHAT_USERS,
    }).valueChanges.pipe(
      map((result: any) => result.data.getChatUsers)
    );
  }

  chatuserdetails(id: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_USER_DETAIL,
      variables: { id },
    }).valueChanges.pipe(
      map((result: any) => result.data?.getUserDetail)
    );
  }

  getChats(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CHATS,
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map((result: any) => result.data.getChats)
    );
  }

  getChatHistory(otherUserId: string) {
    return this.apollo.watchQuery({
      query: GET_CHAT_HISTORY,
      variables: { otherUserId },
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map((result: any) => result.data.getChatHistory)
    );
  }

  profile(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_PROFILE,
    }).valueChanges.pipe(
      map((result: any) => {
        localStorage.setItem('profileData', JSON.stringify(result.data.getprofile));
        return !!result.data.getprofile;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

}
