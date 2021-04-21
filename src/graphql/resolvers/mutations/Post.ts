import { storePostImages, IStorePostImagesArgs } from "../../../utils";
import { Agency, Post, User } from "../../../database";
interface CreatePostArgs {
  post: {
    title: string;
    description: string;
    tags: string[];
    brand: string;
    model: string;
    year: number;
    mileage: {
      unit: string;
      value: number;
    };
    fuel: string;
    transmission: string;
    paintColor: string;
    interiorColor: string;
    images: IStorePostImagesArgs[];
    pricing: {
      currency: string;
      amount: number;
    };
    doors: number;
    category: string;
    condition: string;
    cover: string;
    features: string;
    cylinders: number;
    passengers: number;
    traction: string;
    accessories: string;
    typeModel: string;
    includeds: string[];
    version: string;
  };
  userId: string;
}

export default {
  Mutation: {
    async createPost(_: any, { post, userId }: CreatePostArgs) {
      let imagesUploaded;
      let agencyId = "";

      try {
        const userFound = await User.findOne({
          $and: [{ _id: userId }, { profileCompleted: true }, { isDisabled: false }],
        });

        agencyId = userFound.agency;
      } catch (err) {
        console.log(err);
        return;
      }

      const {
        title,
        description,
        category,
        tags,
        brand,
        model,
        typeModel,
        year,
        cover,
        mileage,
        fuel,
        transmission,
        cylinders,
        passengers,
        doors,
        traction,
        accessories,
        paintColor,
        interiorColor,
        includeds,
        images,
        pricing,
        condition,
        features,
        version,
      } = post;

      try {
        imagesUploaded = await storePostImages(images, cover);
      } catch (err) {
        throw new Error(err);
      }

      const newPost = new Post({
        title,
        description,
        category,
        tags,
        brand,
        model,
        typeModel,
        year,
        mileage,
        fuel,
        transmission,
        cylinders,
        passengers,
        doors,
        traction,
        accessories,
        paintColor,
        interiorColor,
        includeds,
        images: imagesUploaded?.images,
        cover: imagesUploaded?.cover,
        pricing,
        condition,
        features,
        version,
        agency: agencyId,
      });

      try {
        const postCreated = await newPost.save();
        await Agency.findOneAndUpdate({ _id: agencyId }, { $push: { posts: postCreated.id } }, { new: true });
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
