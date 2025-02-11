import { IResolvers } from '@graphql-tools/utils';
import axios from 'axios';
import { Types } from 'mongoose';
import Bottleneck from 'bottleneck';
import Competition from '../models/Competition';
import Team from '../models/Team';
import Player from '../models/Player';
import Coach from '../models/Coach';

// Bottleneck instance to limit API requests (10 requests per minute)
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 6000
});

const fetchWithLimit = async (url: string): Promise<any> => {
  return limiter.schedule(() => axios.get(url, {
    headers: { 'X-Auth-Token': process.env.SOCCER_API_TOKEN }
  }));
};

const importLeagueResolver: IResolvers = {
  Mutation: {
    importLeague: async (_parent, { leagueCode }) => {
      try {
        const { data: leagueData } = await fetchWithLimit(`${process.env.SOCCER_BASE_URI}/competitions/${leagueCode}`)
        const { data: { teams: teamsData } } = await fetchWithLimit(`${process.env.SOCCER_BASE_URI}/competitions/${leagueCode}/teams`)
    
        const competition = await Competition.findOneAndUpdate(
          { code: leagueData.code },
          { name: leagueData.name, areaName: leagueData.area.name },
          { new: true, upsert: true }
        );
    
        for (const team of teamsData) {
          let teamDocument = await Team.findOne({ name: team.name });
    
          if (teamDocument) {
            if (!teamDocument.leagues.includes(competition._id as Types.ObjectId)) {
              teamDocument.leagues.push(competition._id as Types.ObjectId);
            }
          } else {
            teamDocument = new Team({
              name: team.name,
              tla: team.tla,
              shortName: team.shortName,
              areaName: team.area.name,
              address: team.address,
              leagues: [competition._id],
              players: [],
              coach: null,
            });
    
            let playerIds: Types.ObjectId[] = [];
            if (team.squad.length > 0) {
              for (const player of team.squad) {
                const playerDocument = await Player.findOneAndUpdate(
                  { name: player.name },
                  { position: player.position, dateOfBirth: player.dateOfBirth, nationality: player.nationality, team: teamDocument._id },
                  { new: true, upsert: true }
                );
                playerIds.push(playerDocument._id as Types.ObjectId);
              }
              teamDocument.players = playerIds;
            }
    
            const coachDocument = await Coach.findOneAndUpdate(
              { name: team.coach.name },
              { dateOfBirth: team.coach.dateOfBirth, nationality: team.coach.nationality, team: teamDocument._id },
              { new: true, upsert: true }
            );
            teamDocument.coach = coachDocument._id as Types.ObjectId;
          }
    
          await teamDocument.save();
        }
    
        return { success: true, message: `League ${leagueCode} imported successfully` };
      // TODO: update to not use any
      } catch (error: any) {
         // TODO: manage error logging
        return { success: false, message: error.response.data.message || 'Error importing league' };
      }
    },
  },
};

export default importLeagueResolver.Mutation;
