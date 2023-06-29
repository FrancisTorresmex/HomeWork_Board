using HomeWork_Board.Database;
using HomeWork_Board.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Text.Json;

namespace HomeWork_Board.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetTask()
        {
            var lst = new List<Task>();
           var lstTask =  await _context.Task.ToListAsync();
            if (lstTask.Any())
            {
                return Json(lstTask);
            }
            else
            {
                return Json(lst);
            }
            
        }

        [HttpPost]
        public async Task<IActionResult> SaveTask(TaskModel task)
        {
            try
            {
                var taskEdit = await _context.Task.FirstOrDefaultAsync(x => x.Id == task.Id);
                if (taskEdit != null)
                {
                    taskEdit.Title = task.Title;
                    taskEdit.Description = task.Description;
                    taskEdit.Top = task.Top;
                    taskEdit.Left = task.Left;
                    taskEdit.Color = task.Color;

                    _context.Update(taskEdit);
                }
                else
                {
                    await _context.AddAsync(task);
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw;
            }
           
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTask(string idTask)
        {
            try
            {
                var taskElement = _context.Task.FirstOrDefault(x => x.Id == idTask);
                if (taskElement != null)
                {
                    _context.Remove(taskElement);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return Ok();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}