// Importa os módulos necessários do Firebase e React
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import "./Styles.css"; // Importa um arquivo de estilo
import { useEffect, useState } from "react";

export default function App() {
  // Variável de estado para armazenar os dados dos usuários
  const [data, setData] = useState([]);

  // Variável de estado para controlar o carregamento dos dados
  const [isLoaded, setLoaded] = useState(false);

  // Efeito que é executado ao montar o componente
  useEffect(() => {
    // TODO: Adicione SDKs para os produtos do Firebase que você deseja usar.
    // Consulte: https://firebase.google.com/docs/web/setup#available-libraries

    // Configuração do Firebase para o aplicativo da web
    const firebaseConfig = {
      apiKey: "AIzaSyBtYIE4VAvpq--oisF3VqWflloQ6Tq5F6c",
      authDomain: "exempllo.firebaseapp.com",
      databaseURL: "https://exempllo-default-rtdb.firebaseio.com",
      projectId: "exempllo",
      storageBucket: "exempllo.appspot.com",
      messagingSenderId: "799634090876",
      appId: "1:799634090876:web:03b842877e26e00dc712f9"
    };

    // Inicializa o Firebase com a configuração
    const app = initializeApp(firebaseConfig);

    // Obtém uma referência ao banco de dados
    const db = getDatabase(app);

    // Cria uma referência à coleção "users" no banco de dados
    const userRef = ref(db, "/users");

    // Cria uma referência à coleção "produtos" no banco de dados e remove seus dados
    const prodRef = ref(db, "/produtos");
    remove(prodRef);

    // Configura um ouvinte para os dados na coleção "users"
    onValue(userRef, async (snapshot) => {
      const data = await snapshot.val();
      console.log("Dados brutos do Firebase:");
      console.log(data);

      // Inicializa um array para armazenar os dados dos usuários
      let dados = [];

      // Itera sobre os dados da snapshot e os armazena no array
      snapshot.forEach((item) => {
        if (item != null) {
          dados.push(item.val());
        }
      });

      // Ordena os usuários pelo nome
      dados.sort((a, b) => a.name.localeCompare(b.name));

      // Atualiza a variável de estado "data" com os dados e define "isLoaded" como verdadeiro
      await setData(dados);
      setLoaded(true);
    });
  }, []);

  // Efeito que é acionado sempre que a variável de estado "data" é alterada
  useEffect(() => {
    console.log("Dados atuais:");
    console.log(data);
  }, [data]);

  // Função que renderiza os dados dos usuários em tabelas
  function renderUsers(users) {
    return (
      <div>
        {users.map((user, i) => (
          <table key={i} className="user-table">
            <tbody>
              <tr>
                <th colSpan="2">Name: {user.name}</th>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <th>BS</th>
                <td>{user.company.bs}</td>
              </tr>
              <tr>
                <th>CatchPhrase</th>
                <td>{user.company.catchPhrase}</td>
              </tr>
              <tr>
                <th>Company Name</th>
                <td>{user.company.name}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>{user.website}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    );
  }

  // Retorna o conteúdo do componente
  return <div>{isLoaded ? renderUsers(data) : "Carregando..."}</div>;
}

// Fim do componente App
