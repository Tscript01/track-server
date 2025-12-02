import Post from "../models/post.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content } =  JSON.parse(req.body.data)
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }
    console.log('huit==');
    
    let attachments = [];
<<<<<<< HEAD
// console.log(req.files);


=======
console.log('man was here', req.files)
>>>>>>> 233fe5fa8418bada8204aab239aad197005016cb
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(
          file.buffer,
          file.originalname,
          { folder: "trackposts" }
        );
        attachments.push({
          filename: uploadResult.public_id,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: uploadResult.secure_url,
        });
      }
    }

    const post = await Post.create({
      title,
      content,
      attachments,
      author: req.user._id, 
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};


export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};


export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};


export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: 'Not authorized to update this post' });

    const updates = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
   for (const attachment of post.attachments) {
      await deleteFromCloudinary(attachment.filename);
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};


export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.userId,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post.comments,
    });
  } catch (err) {
    next(err);
  }
};
