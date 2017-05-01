import cassandra from 'cassandra-driver';
import { realtimeDBUrl, realtimeDBKeySpace } from '../../config';

function CassandraClient() {
  console.log('realtimeDBUrl: ', realtimeDBUrl);
  console.log('realtimeDBKeySpace: ', realtimeDBKeySpace);
  this.client = new cassandra.Client({ contactPoints: realtimeDBUrl,
    keyspace: realtimeDBKeySpace });

  this.queryRealTimeDB = (query, params, callback) => {
    this.client.execute(query, params, { prepare: true }, (err, results) => {
      console.log(query);
      console.log(params);
      callback(err, results);
    });
  };
}

export default CassandraClient;

