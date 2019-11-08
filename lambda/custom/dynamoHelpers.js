const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.add = async (
  tableName,
  item
) => {
  const params = {
    TableName: tableName,
    Item: {
      id: uuid.v4(),
      ...item
    },
    ReturnValues: "ALL_OLD"
  };
  return await dynamoDb.put(params).promise();
};


module.exports.get = async (params) => {
    return await dynamoDb.scan(params).promise();
}

module.exports.findContactInDb = async (userId, friend) => {
    const params = {
        TableName: "birthday",
        FilterExpression: "#userId = :userId AND #friend = :friend",
        ExpressionAttributeNames: {
          "#userId": "userId",
          "#friend": "friend"
        },
        ExpressionAttributeValues: {
          ":userId": userId,
          ":friend": friend
        }
      };
  
      let got;
      try {
        got = await  dynamoDb.scan(params).promise();
      } catch (err) {
        console.log("ERR", err);
      }
      if (got.Items == null) {
        return [];
      } else {
        return got.Items;
      }
}

module.exports.deleteBirthday = async (id) => {
  const params = {
    TableName: "birthday",
    "Key" : {
      "id": id
  }
  };

  let got;
  try {
    got = await  dynamoDb.delete(params).promise();
  } catch (err) {
    console.log("ERR", err);
    return null;
  }
  return got;
}