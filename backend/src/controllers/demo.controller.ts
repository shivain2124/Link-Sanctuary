// // Delete folder and all its children
// export const deleteFolder = async (req: Request, res: Response) => {
//   try {
//     const { folderId } = req.params;
//     const userId = req.user?.id;

//     // Find all descendants
//     const descendants = await Folder.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(folderId),
//           userId: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $graphLookup: {
//           from: "folders",
//           startWith: "$_id",
//           connectFromField: "_id",
//           connectToField: "parentId",
//           as: "allChildren",
//         },
//       },
//     ]);

//     if (descendants.length === 0) {
//       return res.status(404).json({ error: "Folder not found" });
//     }

//     const idsToDelete = [
//       folderId,
//       ...descendants[0].allChildren.map((c: any) => c._id),
//     ];

//     await Folder.deleteMany({ _id: { $in: idsToDelete } });

//     res.json({
//       success: true,
//       message: "Folder and children deleted",
//       deletedCount: idsToDelete.length,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete folder" });
//   }
// };
