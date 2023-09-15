<template>
  <div class="about">
    <form action="" method="POST">
      <label id="id" for="id"></label>
      <input type="text" placeholer="Session ID">
      <input id="submit1" type="submit" value="Join">
    </form>
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

form {
  margin: 20% auto; /* Ajoutez cette ligne pour centrer le formulaire horizontalement */
  width: 20%;
  padding: 30px;
  border: 1px solid #f1f1f1;
  background: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

input[type=email], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input[type=submit] {
  background-color: #f1dc66;
  border: none;
  color: white;
  padding: 14px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 15px;
  border: none;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

input[type=submit]:hover {
  transform: scale(1.06);
  background-position: -60px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

}

input[type=submit]:active {
  transform: scale(1);
  background-position: 500px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

</style>
