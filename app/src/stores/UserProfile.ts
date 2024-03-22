import { makeAutoObservable } from "mobx";
import type { UserProfile as UserProfileType } from "@task-2/service/types";

export class UserProfile implements UserProfileType {
  id: number
  bio: string
  firstName: string
  lastName: string
  dateOfBirth: number
  country: string
  city: string

  constructor(profile: UserProfileType) {
    this.id = profile.id
    this.bio = profile.bio
    this.firstName = profile.firstName
    this.lastName = profile.lastName
    this.dateOfBirth = profile.dateOfBirth
    this.country = profile.country
    this.city = profile.city

    makeAutoObservable(this);
  }

  isEmpty() {
    return [
      this.bio,
      this.firstName,
      this.lastName,
      this.dateOfBirth,
      this.country,
      this.city
    ].every((v) => !v)
  }
}
