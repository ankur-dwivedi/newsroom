// const Pool = require('pg').Pool
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'newsroom',
//   password: 'password',
//   port: 5432,
// })
const getUsers = (request, response) => {
  client.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const login = (request, response) => {
  const { email,password } = request.body
  client.query('SELECT * FROM users WHERE email = $1 and password=$2', [email,password], (error, results) => {
    if (error) {
      throw error
    }
    //response.status(200).json(results.rows)
    if(results.rows.length===0)
    response.status(200).json({"status" : "Email or password is incorrect"})
    else
    {
      let token=Math.random().toString(36).substr(2);
      client.query('update users set token=$1 where email=$2', [token, email], (error, results) => {
        if (error) {
          throw error
        }
        client.query('SELECT * FROM users WHERE email = $1 and password=$2', [email,password], (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).json(results.rows)
        })
      })
    }
  })
}

const getUserByToken = (request, response) => {
  const { token } = request.body

  client.query('SELECT * FROM users WHERE token = $1', [token], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email,role,specialization,password,birthday,gender,image } = request.body

  client.query('SELECT name FROM users WHERE email= $1', [email], (error, results) => {
    if (error) {
      console.log(error)
    }
    if(results.rows.length!==0)
    response.status(200).json({"status" : "email allready registered"})
    else
    {
      client.query('INSERT INTO users (name,email,role,specialization,password,birthday,gender,image)  VALUES ($1, $2,$3,$4,$5,$6,$7,$8)', [name, email,role,specialization,password,birthday,gender,image], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json({"status" : "registered"})
      })
    }
  })

  
}

const getStory = (request, response) => {
  client.query('SELECT * FROM story ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getStoryById = (request, response) => {
  const { id} = request.body

  client.query('SELECT * FROM story WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createStory = (request, response) => {
  const { title, writer,status,description,image,topic} = request.body

  client.query('INSERT INTO story (title, writer,status,description,image,topic)  VALUES ($1, $2,$3,$4,$5,$6)', [ title, writer,status,description,image,topic], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  client.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteStory = (request, response) => {
  const { id } = request.body


  client.query('DELETE FROM story WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  login,
  createUser,
  getUserByToken,
  getStory,
  getStoryById,
  createStory,
  updateUser,
  deleteStory,
}
