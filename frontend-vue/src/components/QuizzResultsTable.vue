<template>
  <table class="styled-table">
    <div v-if="this.tabresult != null">
    <tr>
      <th>Participant</th>
      <th v-for="(question, index) in this.tabresult[0]" :key="index">{{ question.content }}</th>
    </tr>


      <tr v-for="(participant, index) in this.tabresult[1]" :key="index">
        <td v-if="participant">{{ participant.username }}</td>
        <td v-else>No participant data available</td>
        <td v-for="(rep, ind) in participant.tab" :key="ind" :style="{'background-color': isAnswerCorrect(rep) ? 'lightgreen' : 'tomato'}">{{ this.tabresult[0][rep.idQuestion-1]?.answers.find(answer => answer.id === rep.idAnswer).content || "bonjour, je suis désolé mais il y a une erreur" }}</td>
      </tr>
    </div>

  </table>
</template>

<script>

  import { id } from 'postcss-selector-parser';

  export default {
    data() {
      return {
        tabresult: null,
      }
    },
    methods: {
      id,
      async handleCreateTable() {
        try {
          await this.$store.dispatch('getResults');
          // const tabResult = await this.$store.getters.getTabResult;
          // console.log("-----------------------------------------");
          // console.log(tabResult[1][0].username);
          // console.log("-----------------------------------------");
          this.$router.push('/end-of-session');
        } catch (error) {
          console.error('Error while creating session:', error);
        }
      },
      async getTab() {
        return await this.$store.getters.getTabResult;
      },
      isAnswerCorrect(rep) {
        return this.tabresult[0][rep.idQuestion - 1].answers.find(answer => answer.id === rep.idAnswer).isCorrect;
      },
    },
    async created() {
      await this.handleCreateTable()
      this.tabresult = await this.getTab()
    },
  };

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