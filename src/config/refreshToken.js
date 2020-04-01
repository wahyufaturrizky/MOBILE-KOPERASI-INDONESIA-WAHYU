import { arkPost } from "./api";
import { getStorage, setStorage } from "./storage";

export const refreshToken = async () => {
        try {
          let body = await getStorage('auth')
          let login = await arkPost('login', body, 'member');
          if (login) {
            if (login.Status === 200) {
              setStorage('user', login.Data.user_profile);
              setStorage('token', login.Data.token);
              return login.Data.user_profile;
            }
          }
        } catch (err) {
          console.log(err)
          alert(JSON.stringify(err))
        }
}