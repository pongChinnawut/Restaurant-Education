import axios from "axios";

export const API_getRaurant = () => {
  axios.create({
    baseURL: "https://api.yelp.com/v3/businesses",
    headers: {
      Authorization:
        "Bearer xkgRw9irFZP-wMk8YQYviQ9lU_bF-ueMA5JThyhj1Omyq9VUAcYpOJbiCEZbURekeNyihkZ_6vw8TKekVk5jHmRS6taO8aj9vg5yTA8-L_5YVBz7s96RMfI3-NogYHYx",
    },
  });
};

export default axios.create({
  baseURL: "https://api.yelp.com/v3/businesses",
  headers: {
    Authorization:
      "Bearer xkgRw9irFZP-wMk8YQYviQ9lU_bF-ueMA5JThyhj1Omyq9VUAcYpOJbiCEZbURekeNyihkZ_6vw8TKekVk5jHmRS6taO8aj9vg5yTA8-L_5YVBz7s96RMfI3-NogYHYx",
  },
});
// mnWsQSbtqyvAUCLsL3TBPg
// xkgRw9irFZP-wMk8YQYviQ9lU_bF-ueMA5JThyhj1Omyq9VUAcYpOJbiCEZbURekeNyihkZ_6vw8TKekVk5jHmRS6taO8aj9vg5yTA8-L_5YVBz7s96RMfI3-NogYHYx
