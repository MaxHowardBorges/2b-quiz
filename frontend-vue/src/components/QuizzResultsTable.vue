<template>
  <table class="styled-table">
    <tr>
      <th>Nom du Participant</th>
      <th>Réponse à la Question 1</th>
      <th>Réponse à la Question 2</th>
      <th>Réponse à la Question 3</th>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
    </tr>
  </table>
</template>

<script>

</script>

<style>
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1em;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  .styled-table th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
    padding: 10px 15px;
    text-align: left;
  }

  .styled-table td {
    padding: 10px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    background-color: white;
  }

  .styled-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .styled-table tr:hover {
    background-color: #ddd;
  }
</style>