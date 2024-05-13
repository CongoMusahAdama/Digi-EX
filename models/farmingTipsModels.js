//weather, farm. post
const mongoose = require('mongoose');

const farmingTipsSchema = new mongoose.schema({

     weather:{
          temperature: { type: Number, required: true },
          description: { type: String, required: true },
          icon: { type: String, required: true },
          currentTime: { type: Date, required: true }
     },

     farm:{
        name: { type: String, required: true },
        location: { type: String, required: true },
        contact: { type: String, required: true },
        image: { type: String, required: true }
     },

     post:{
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        created: { type: Date, default: Date.now },
        farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true }
     },
     
  },
  {
    timestamp: true,
  }

);

export default  mongoose.model("farmingTips", farmingTipsSchema);









    