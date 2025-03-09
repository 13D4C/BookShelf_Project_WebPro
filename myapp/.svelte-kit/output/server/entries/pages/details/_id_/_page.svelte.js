import { V as store_get, a9 as copy_payload, aa as assign_payload, W as unsubscribe_stores, T as pop, X as escape_html, Z as ensure_array_like, Y as attr, Q as push } from "../../../../chunks/index.js";
import "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/stores.js";
import { w as writable } from "../../../../chunks/index2.js";
import "@jaames/iro";
import { R as Rating } from "../../../../chunks/Rating.js";
import { h as html } from "../../../../chunks/html.js";
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="text-yellow-500">★</span>';
  }
  if (halfStar) {
    starsHTML += '<svg class="text-yellow-500 inline-block h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="text-gray-300">★</span>';
  }
  return starsHTML;
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let discountedPrice;
  let book = {};
  let quantity = 1;
  let relatedBooks = [];
  let isLoadingRelatedBooks = true;
  let isLoadingBook = true;
  let errorMessage = "";
  let userId;
  let bookId = store_get($$store_subs ??= {}, "$page", page).params.id;
  let newComment = "";
  let update = true;
  let comments = writable([]);
  let replyComment = "";
  let replyMode = writable({});
  async function fetchBookData(bookId2) {
    isLoadingBook = true;
    isLoadingRelatedBooks = true;
    errorMessage = "";
    try {
      const response = await fetch(`http://localhost:3000/books?id=${bookId2}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        book = data;
      } else {
        book = {};
        errorMessage = "Book not found";
      }
    } catch (error) {
      console.error("Error fetching main book details:", error);
      errorMessage = "Failed to load book details. Please try again later.";
    } finally {
      isLoadingBook = false;
    }
    if (book.serie_id) {
      try {
        const response = await fetch(`http://localhost:3000/books/series/${book.serie_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        relatedBooks = data;
      } catch (error) {
        console.error("Error fetching related books:", error);
        errorMessage = "Failed to load related books.";
        relatedBooks = [
          {
            image: "https://via.placeholder.com/200",
            title: "Book 1"
          },
          {
            image: "https://via.placeholder.com/200",
            title: "Book 2"
          },
          {
            image: "https://via.placeholder.com/200",
            title: "Book 3"
          }
        ];
      } finally {
        isLoadingRelatedBooks = false;
      }
    } else {
      relatedBooks = [];
      isLoadingRelatedBooks = false;
    }
  }
  const isLoading = writable(true);
  const API_BASE = "http://localhost:3000";
  async function fetchComments() {
    try {
      const response = await fetch(`${API_BASE}/books/${bookId}/comments`);
      const data = await response.json();
      comments.set(organizeComments(data));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }
  function organizeComments(comments2) {
    const commentMap = {};
    const rootComments = [];
    comments2.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;
      if (comment.reply_id) {
        if (commentMap[comment.reply_id]) {
          commentMap[comment.reply_id].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });
    return rootComments;
  }
  discountedPrice = book.discount ? book.price * (1 - book.discount / 100) : book.price;
  if (store_get($$store_subs ??= {}, "$page", page).params.id || update) {
    quantity = 1;
    bookId = store_get($$store_subs ??= {}, "$page", page).params.id;
    fetchBookData(bookId);
    fetchComments();
    update = false;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="fixed inset-0 flex items-center justify-center bg-blue-50 z-50"><div class="spinner animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="min-h-screen bg-blue-50"><div class="max-w-7xl mx-auto p-6">`;
      if (errorMessage) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<p class="text-red-500">${escape_html(errorMessage)}</p>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      if (isLoadingBook) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="animate-pulse"><div class="h-64 bg-gray-300 rounded-lg"></div> <div class="mt-4 space-y-2"><div class="h-6 bg-gray-300 rounded"></div> <div class="h-4 bg-gray-300 rounded w-3/4"></div> <div class="h-4 bg-gray-300 rounded w-1/2"></div></div></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
        const each_array_1 = ensure_array_like([1, 2, 3, 4, 5]);
        $$payload2.out += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="relative">`;
        if (book.book_image) {
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<div class="max-w-xs">`;
          {
            $$payload2.out += "<!--[-->";
            $$payload2.out += `<img class="w-full rounded-lg object-cover"${attr("src", book.book_image)}${attr("alt", book.book_name_originl)}>`;
          }
          $$payload2.out += `<!--]--></div>`;
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]--></div> <div class="space-y-4"><h1 class="text-3xl font-bold">${escape_html(book.book_name_originl)}</h1> <div class="flex items-center">`;
        Rating($$payload2, {
          id: "example-3",
          total: 5,
          rating: book.book_score
        });
        $$payload2.out += `<!----></div> <p class="text-2xl text-red-600 font-semibold">`;
        if (book.discount) {
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<span class="line-through text-gray-600 text-lg">${escape_html(book.book_price)} บาท</span> ${escape_html(discountedPrice.toFixed(0))} บาท`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `${escape_html(book.book_price)} บาท`;
        }
        $$payload2.out += `<!--]--></p> <div class="flex items-center"><label class="mr-2 text-lg">จำนวน</label> <button class="px-4 py-2 bg-gray-500 rounded text-xl">-</button> <span class="px-4 text-xl">${escape_html(quantity)}</span> <button class="px-4 py-2 bg-gray-300 rounded text-xl">+</button></div> <div class="flex gap-4"><button class="px-8 py-3 border border-orange-500 text-orange-500 rounded text-lg">ใส่รถเข็น</button> <button class="px-8 py-3 bg-orange-500 text-white rounded text-lg">แก้ไข</button></div> `;
        {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]--></div></div> <div class="mt-8"><h2 class="text-xl font-semibold">รายละเอียด :</h2> <p class="text-gray-600 mt-2">${escape_html(book.book_descriptions)}</p></div> <div class="mt-8"><button class="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">📢 รายงานหนังสือเล่มนี้</button></div> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-gray-100 p-4 rounded-lg">`;
        Rating($$payload2, {
          id: "example-3",
          total: 5,
          rating: book.book_score,
          $$slots: {
            text: ($$payload3) => {
              $$payload3.out += `<p slot="text" class="ms-2 text-sm font-medium text-gray-500 dark:text-gray-800">${escape_html(book.book_score.toFixed(2))} out of 5</p>`;
            }
          }
        });
        $$payload2.out += `<!----></div> <div class="bg-gray-100 p-4 rounded-lg"><h3 class="font-semibold">รีวิวจากลูกค้า</h3> <p class="text-gray-600 mt-2">${escape_html(book.reviewText)}</p></div></div> <div class="mt-8 p-4 border-solid border-gray-50 rounded-lg bg-slate-200"><h3 class="text-2xl font-bold mb-4 text-stone-800">Comments</h3> <div class="post-comment"><form class="flex flex-col"><textarea rows="4" placeholder="Write your comment here..." class="comment-textarea w-full p-2 mb-2 border-solid border-slate-300 rounded svelte-167igg5" required>`;
        const $$body = escape_html(newComment);
        if ($$body) {
          $$payload2.out += `${$$body}`;
        }
        $$payload2.out += `</textarea> <div class="comment-form-controls flex items-center space-x-4 svelte-167igg5"><div class="flex flex-col"><label for="score" class="text-sm font-medium text-gray-700">Score</label> <select id="score" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required><!--[-->`;
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let s = each_array_1[$$index_1];
          $$payload2.out += `<option${attr("value", s)}>${escape_html(s)}</option>`;
        }
        $$payload2.out += `<!--]--></select></div> <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit Comment</button></div></form></div> `;
        if (store_get($$store_subs ??= {}, "$comments", comments).length > 0) {
          $$payload2.out += "<!--[-->";
          const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$comments", comments));
          $$payload2.out += `<div class="comments-list svelte-167igg5"><!--[-->`;
          for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
            let comment = each_array_2[$$index_3];
            $$payload2.out += `<div class="comment-card svelte-167igg5"><div class="comment-header svelte-167igg5"><img${attr("src", comment.user_image)}${attr("alt", comment.user_name)} class="user-image svelte-167igg5"> <div class="user-info svelte-167igg5"><p class="user-name svelte-167igg5">${escape_html(comment.user_name)}   ${html(generateStars(comment.score))}</p> <p class="timestamp svelte-167igg5">${escape_html(new Date(comment.time_stamp).toLocaleString())}</p></div></div> <div class="comment-body svelte-167igg5"><p>${escape_html(comment.comment_detail)}</p></div> <div class="comment-footer"><div>`;
            if (comment.user_id === userId) {
              $$payload2.out += "<!--[-->";
              $$payload2.out += `<button class="delete-button svelte-167igg5">Delete</button>`;
            } else {
              $$payload2.out += "<!--[!-->";
            }
            $$payload2.out += `<!--]--> <button class="reply-button svelte-167igg5">Reply</button></div> <br> `;
            if (store_get($$store_subs ??= {}, "$replyMode", replyMode)[comment.comment_id]) {
              $$payload2.out += "<!--[-->";
              $$payload2.out += `<div class="border p-4 rounded bg-white my-2"><textarea rows="2" placeholder="Write your reply here..." class="w-full border rounded p-2 svelte-167igg5" required>`;
              const $$body_1 = escape_html(replyComment);
              if ($$body_1) {
                $$payload2.out += `${$$body_1}`;
              }
              $$payload2.out += `</textarea> <button class="mt-1 px-3 py-1 bg-gray-500 text-white rounded text-sm">Submit Reply</button></div>`;
            } else {
              $$payload2.out += "<!--[!-->";
            }
            $$payload2.out += `<!--]--> `;
            if (comment.replies.length > 0) {
              $$payload2.out += "<!--[-->";
              const each_array_3 = ensure_array_like(comment.replies);
              $$payload2.out += `<div class="replies-list svelte-167igg5"><!--[-->`;
              for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                let reply = each_array_3[$$index_2];
                $$payload2.out += `<div class="reply-comment svelte-167igg5"><div class="reply-header svelte-167igg5"><img${attr("src", reply.user_image)}${attr("alt", reply.user_name)} class="user-image svelte-167igg5"> <div class="user-info svelte-167igg5"><p class="user-name svelte-167igg5">${escape_html(reply.user_name)}</p> <p class="timestamp svelte-167igg5">${escape_html(new Date(reply.time_stamp).toLocaleString())}</p></div></div> <div class="reply-body svelte-167igg5"><p>${escape_html(reply.comment_detail)}</p></div> `;
                if (reply.user_id === userId) {
                  $$payload2.out += "<!--[-->";
                  $$payload2.out += `<button class="delete-button svelte-167igg5">Delete</button>`;
                } else {
                  $$payload2.out += "<!--[!-->";
                }
                $$payload2.out += `<!--]--></div>`;
              }
              $$payload2.out += `<!--]--></div>`;
            } else {
              $$payload2.out += "<!--[!-->";
            }
            $$payload2.out += `<!--]--></div></div>`;
          }
          $$payload2.out += `<!--]--></div>`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<p class="no-comments svelte-167igg5">No comments yet.</p>`;
        }
        $$payload2.out += `<!--]--></div>`;
      }
      $$payload2.out += `<!--]--> <div class="mt-8"><h2 class="text-xl font-semibold">หนังสือที่เกี่ยวข้อง</h2> `;
      if (isLoadingRelatedBooks) {
        $$payload2.out += "<!--[-->";
        const each_array_4 = ensure_array_like(Array(4));
        $$payload2.out += `<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><!--[-->`;
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          each_array_4[$$index_4];
          $$payload2.out += `<div class="bg-gray-200 h-40 rounded-lg animate-pulse"></div>`;
        }
        $$payload2.out += `<!--]--></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
        const each_array_5 = ensure_array_like(relatedBooks);
        $$payload2.out += `<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">`;
        if (each_array_5.length !== 0) {
          $$payload2.out += "<!--[-->";
          for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
            let related = each_array_5[$$index_5];
            $$payload2.out += `<div class="bg-gray-200 h-40 rounded-lg overflow-hidden">`;
            if (related.book_image) {
              $$payload2.out += "<!--[-->";
              $$payload2.out += `<img class="h-48 w-96 object-scale-down place-content-center"${attr("src", related.book_image)}${attr("alt", related.book_name_originl || "Related Book")} loading="lazy">`;
            } else {
              $$payload2.out += "<!--[!-->";
            }
            $$payload2.out += `<!--]--></div>`;
          }
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<p>No related books found.</p>`;
        }
        $$payload2.out += `<!--]--></div>`;
      }
      $$payload2.out += `<!--]--></div></div></div>`;
    }
    $$payload2.out += `<!--]--> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
